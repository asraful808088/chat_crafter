function validateLayers(layers) {
    let hasGlobalPooling = false;
    let hasBatchNormalization = false;
    let multiHeadAttentionIndex = -1;
    let afterAttentionLayers = ["dense", "dropout", "global_average_pooling_1D"];

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];

        if (layer.type === "multi_head_self_attention") {
            multiHeadAttentionIndex = i;
        }

        if (layer.type === "global_average_pooling_1D") {
            if (hasGlobalPooling) {
                console.log("Error: `global_average_pooling_1D` can only be used once.");
                return false;
            }
            hasGlobalPooling = true;
        }

        if (layer.type === "batch_normalization") {
            if (hasBatchNormalization) {
                console.log("Error: `batch_normalization` can only be used once.");
                return false;
            }
            hasBatchNormalization = true;
        }
    }

    if (multiHeadAttentionIndex !== -1) {
        let foundGlobalPooling = false;
        for (let j = multiHeadAttentionIndex + 1; j < layers.length; j++) {
            const nextLayer = layers[j].type;
            if (!afterAttentionLayers.includes(nextLayer)) {
                console.log(`Error: Invalid layer \`${nextLayer}\` after \`multi_head_self_attention\`.`);
                return false;
            }
            if (nextLayer === "global_average_pooling_1D") {
                foundGlobalPooling = true;
                break;
            }
        }
        if (!foundGlobalPooling) {
            console.log("Error: `multi_head_self_attention` must be followed by `global_average_pooling_1D`.");
            return false;
        }
    }

    console.log("Layers are valid.");
    return true;
}

const layers1 = [
    { type: "dropout" },
    { type: "dense" },
    { type: "multi_head_self_attention" },
    { type: "dense" },
    { type: "dropout" },
    { type: "global_average_pooling_1D" },
    // { type: "batch_normalization" }
];

const layers2 = [
    { type: "dropout" },
    { type: "dense" },
    { type: "multi_head_self_attention" },
    { type: "global_average_pooling_1D" },
    { type: "batch_normalization" }, 


];

const layers3 = [
    { type: "multi_head_self_attention" },
    { type: "dense" },

    { type: "dropout" },
    { type: "dense" },

    { type: "global_average_pooling_1D" }
];

validateLayers(layers1); 
validateLayers(layers2);
validateLayers(layers3); 
