import json
import csv

def export_to_json(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

def export_to_csv(json_file, csv_file):
    with open(json_file, "r") as f:
        data = json.load(f)

    with open(csv_file, "w", newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        # Write headers
        writer.writerow(["Section", "Content"])

        for key, value in data.items():
            writer.writerow([key, value])

    return csv_file
