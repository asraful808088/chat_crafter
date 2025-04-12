# import psutil

# def get_disk_info():
#     partitions = psutil.disk_partitions()
#     for partition in partitions:
#         usage = psutil.disk_usage(partition.mountpoint)
#         print(f"Drive: {partition.device}")
#         print(f"  Mountpoint: {partition.mountpoint}")
#         print(f"  File System Type: {partition.fstype}")
#         print(f"  Total Size: {usage.total / (1024**3):.2f} GB")
#         print(f"  Used: {usage.used / (1024**3):.2f} GB")
#         print(f"  Free: {usage.free / (1024**3):.2f} GB")
#         print(f"  Usage: {usage.percent}%\n")

# get_disk_info()

import os
import subprocess
import platform
import platform
import psutil
import socket
import subprocess


# def get_drive_info():
#     drives = []

#     if platform.system() == "Windows":
#         try:
#             result = subprocess.run(["wmic", "diskdrive", "get", "Model,MediaType"], capture_output=True, text=True)
#             lines = result.stdout.splitlines()[1:]  
#             for line in lines:
#                 parts = line.strip().split()
#                 if len(parts) >= 2:
#                     model = " ".join(parts[:-1])  
#                     media_type = parts[-1]  
#                     drives.append({"model": model, "type": media_type})
#         except Exception as e:
#             print("Error fetching Windows drive details:", e)

#     elif platform.system() in ["Linux", "Darwin"]: 
#         drive_list = [d for d in os.listdir('/sys/block') if d.startswith("sd")]
#         for drive in drive_list:
#             try:
#                 with open(f"/sys/block/{drive}/queue/rotational", "r") as f:
#                     is_ssd = f.read().strip() == "0"
#                     drive_type = "SSD" if is_ssd else "HDD"
#                     drives.append({"model": f"/dev/{drive}", "type": drive_type})
#             except:
#                 pass

#     return drives

# disk_info = get_drive_info()
# print(disk_info)



# def get_network_info():
#     network_info = {}

#     # Get Hostname
#     network_info["hostname"] = socket.gethostname()

#     # Get Local IP Address
#     try:
#         network_info["local_ip"] = socket.gethostbyname(network_info["hostname"])
#     except socket.gaierror:
#         network_info["local_ip"] = "Unknown"

#     # Get MAC Address & Network Interfaces
#     network_info["interfaces"] = []
#     for interface, addrs in psutil.net_if_addrs().items():
#         ip_address = None  # Initialize IP variable

#         for addr in addrs:
#             if addr.family == socket.AF_INET:  # IPv4 Address
#                 ip_address = addr.address  # Assign IP
#             elif addr.family == psutil.AF_LINK:  # MAC Address
#                 mac_address = addr.address
#                 network_info["interfaces"].append({
#                     "interface": interface,
#                     "mac": mac_address,
#                     "ip": ip_address if ip_address else "No IP"
#                 })

#     # Get Gateway & DNS
#     if platform.system() == "Windows":
#         try:
#             result = subprocess.run(["ipconfig", "/all"], capture_output=True, text=True)
#             network_info["details"] = result.stdout
#         except Exception as e:
#             network_info["error"] = str(e)
#     else:
#         try:
#             result = subprocess.run(["ip", "route"], capture_output=True, text=True)
#             network_info["details"] = result.stdout
#         except Exception as e:
#             network_info["error"] = str(e)

#     return network_info

# # Example Usage
# network_data = get_network_info()
# print(network_data)



# import platform
# import psutil
# import wmi
# import subprocess

# def get_windows_info():
#     info = {}

#     # OS Information
#     info["OS"] = platform.system()
#     info["OS Version"] = platform.version()
#     info["OS Release"] = platform.release()
#     info["Architecture"] = platform.architecture()[0]

#     # System Information
#     info["System Name"] = platform.node()
#     info["Machine Type"] = platform.machine()
#     info["Processor"] = platform.processor()

#     # CPU Details
#     info["CPU Cores (Physical)"] = psutil.cpu_count(logical=False)
#     info["CPU Cores (Logical)"] = psutil.cpu_count(logical=True)
#     info["CPU Frequency"] = f"{psutil.cpu_freq().max:.2f} MHz"

#     # RAM Info
#     ram = psutil.virtual_memory()
#     info["Total RAM"] = f"{ram.total / (1024 ** 3):.2f} GB"

#     # Disk Info
#     info["Disk Drives"] = []
#     for disk in psutil.disk_partitions():
#         usage = psutil.disk_usage(disk.mountpoint)
#         info["Disk Drives"].append({
#             "Drive": disk.device,
#             "Total Space": f"{usage.total / (1024 ** 3):.2f} GB",
#             "Free Space": f"{usage.free / (1024 ** 3):.2f} GB"
#         })

#     # BIOS Info (Requires WMI)
#     try:
#         c = wmi.WMI()
#         bios = c.Win32_BIOS()[0]
#         info["BIOS Version"] = bios.SMBIOSBIOSVersion
#         info["BIOS Manufacturer"] = bios.Manufacturer
#     except Exception:
#         info["BIOS Info"] = "WMI access denied"

#     # GPU Info
#     try:
#         gpus = c.Win32_VideoController()
#         info["GPU"] = [{"Name": gpu.Name, "Memory": f"{int(gpu.AdapterRAM) / (1024 ** 2):.2f} MB"} for gpu in gpus]
#     except Exception:
#         info["GPU"] = "WMI access denied"

#     # Get IP Configuration (Windows)
#     try:
#         result = subprocess.run(["ipconfig"], capture_output=True, text=True)
#         info["Network Info"] = result.stdout
#     except Exception:
#         info["Network Info"] = "Failed to retrieve"

#     return info

# # Example Usage
# windows_data = get_windows_info()
# for key, value in windows_data.items():
#     print(f"{key}: {value}")


# import psutil

# def get_ram_info():
#     ram = psutil.virtual_memory()

#     ram_info = {
#         "Total RAM": f"{ram.total / (1024 ** 3):.2f} GB",  # Total RAM in GB
#         "Used RAM": f"{ram.used / (1024 ** 3):.2f} GB",    # Used RAM in GB
#         "Free RAM": f"{ram.free / (1024 ** 3):.2f} GB",    # Free RAM in GB
#         "Available RAM": f"{ram.available / (1024 ** 3):.2f} GB",  # Available RAM in GB
#         "Percent Used": f"{ram.percent}%",  # Percentage of RAM used
#     }

#     return ram_info

# # Example Usage
# ram_data = get_ram_info()
# for key, value in ram_data.items():
#     print(f"{key}: {value}")




# import psutil
# import datetime

# def get_startup_info():
#     # Get the system boot time (timestamp)
#     boot_time_timestamp = psutil.boot_time()

#     # Convert boot time to a readable format
#     boot_time = datetime.datetime.fromtimestamp(boot_time_timestamp)

#     # Get the system uptime (time since boot)
#     current_time = datetime.datetime.now()
#     uptime = current_time - boot_time

#     # Print the boot time and uptime
#     print(f"System Boot Time: {boot_time.strftime('%Y-%m-%d %H:%M:%S')}")
#     print(f"System Uptime: {str(uptime)}")

# # Example Usage
# get_startup_info()
# import platform
# import subprocess

# def get_cpu_info():
#     system = platform.system()
#     cpu_info = {}

#     if system == "Windows":
#         import wmi
#         c = wmi.WMI()
#         for cpu in c.Win32_Processor():
#             cpu_info = {
#                 "Model": cpu.Name.strip(),
#                 "Cores": cpu.NumberOfCores,
#                 "Threads": cpu.ThreadCount,
#                 "Base Clock (GHz)": round(cpu.MaxClockSpeed / 1000, 2),
#             }
    
    
#     return cpu_info

# cpu_data = get_cpu_info()
# for key, value in cpu_data.items():
#     print(f"{key}: {value}")


import psutil
import time

def get_network_speed(interval=1):
    """Measure Wi-Fi and Ethernet speed in Mbps."""
    # Get the initial stats for all interfaces
    net_io_1 = psutil.net_io_counters(pernic=True)
    
    # Sleep for the specified interval
    time.sleep(interval)
    
    # Get the stats again after the interval
    net_io_2 = psutil.net_io_counters(pernic=True)

    speeds = {}

    # Iterate over all interfaces
    for interface in net_io_1:
        # We will track only Wi-Fi and Ethernet interfaces
        if "Wireless LAN" in interface or "Ethernet" in interface:
            # Calculate the bytes sent and received during the interval
            bytes_sent = net_io_2[interface].bytes_sent - net_io_1[interface].bytes_sent
            bytes_recv = net_io_2[interface].bytes_recv - net_io_1[interface].bytes_recv

            # Calculate the speeds in Mbps (megabits per second)
            speeds[interface] = {
                "Upload Speed (Mbps)": round((bytes_sent * 8) / (interval * 1_000_000), 2),
                "Download Speed (Mbps)": round((bytes_recv * 8) / (interval * 1_000_000), 2),
            }

    return speeds

# Run the speed test
speed_data = get_network_speed(interval=1)

if not speed_data:
    print("No Wi-Fi or Ethernet detected!")
else:
    for interface, data in speed_data.items():
        print(f"Interface: {interface}")
        print(f"  Upload Speed: {data['Upload Speed (Mbps)']} Mbps")
        print(f"  Download Speed: {data['Download Speed (Mbps)']} Mbps")
    print("-" * 40)

