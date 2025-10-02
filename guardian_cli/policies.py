import csv
import os

def get_policies_for_os(os_type: str):
    """
    Reads policies for a specific OS from the feature map.
    """
    policies = []
    try:
        # Get the path relative to this file's location
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        feature_map_path = os.path.join(base_dir, 'feature_map.csv')
        
        with open(feature_map_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['OS'].lower() == os_type.lower():
                    policies.append(row)
    except FileNotFoundError:
        return []
    return policies

if __name__ == '__main__':
    linux_policies = get_policies_for_os("Linux")
    for p in linux_policies[:5]:
        print(p)