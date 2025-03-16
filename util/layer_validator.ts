export default function validateLayers(layers) {
  let hasGlobalPooling = false;
  let hasBatchNormalization = false;
  let multiHeadAttentionIndex = -1;
  let afterAttentionLayers = ["dense", "dropout", "global_average_pooling_1D"];
  const errorMessage = [
    "Invalid layer configuration. Please follow these rules:",
    "1. `global_average_pooling_1D` can only be used once.",
    "2. `batch_normalization` can only be used once.",
    "3. If using `multi_head_self_attention`, it must be followed by one or more of the following layers: " +
      afterAttentionLayers.join(", ") +
      ".",
    "4. `multi_head_self_attention` must eventually be followed by `global_average_pooling_1D`.",
    "Please adjust your layers accordingly.",
  ];

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];

    if (layer.type === "multi_head_self_attention") {
      multiHeadAttentionIndex = i;
    }

    if (layer.type === "global_average_pooling_1D") {
      if (hasGlobalPooling) {
        console.log(
          "Error: `global_average_pooling_1D` can only be used once."
        );
        return { success: false, msg: errorMessage };
      }
      hasGlobalPooling = true;
    }

    if (layer.type === "batch_normalization") {
      if (hasBatchNormalization) {
        console.log("Error: `batch_normalization` can only be used once.");
        return { success: false, msg: errorMessage };
      }
      hasBatchNormalization = true;
    }
  }

  if (multiHeadAttentionIndex !== -1) {
    let foundGlobalPooling = false;
    for (let j = multiHeadAttentionIndex + 1; j < layers.length; j++) {
      const nextLayer = layers[j].type;
      if (!afterAttentionLayers.includes(nextLayer)) {
        console.log(
          `Error: Invalid layer \`${nextLayer}\` after \`multi_head_self_attention\`.`
        );
        return { success: false, msg: errorMessage };
      }
      if (nextLayer === "global_average_pooling_1D") {
        foundGlobalPooling = true;
        break;
      }
    }
    if (!foundGlobalPooling) {
      console.log(
        "Error: `multi_head_self_attention` must be followed by `global_average_pooling_1D`."
      );
      return { success: false, msg: errorMessage };
    }
  }

  console.log("Layers are valid.");
  return { success: true};
}
