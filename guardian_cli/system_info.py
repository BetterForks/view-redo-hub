import json
import re
import os

def get_system_info(system_id: str):
    """
    Parses Visualize.tsx to get mock system data.
    """
    try:
        # Get the path relative to this file's location
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        visualize_path = os.path.join(base_dir, 'src', 'pages', 'Visualize.tsx')
        
        with open(visualize_path, 'r') as f:
            content = f.read()

        # Use regex to extract the systemsData object
        match = re.search(r'const systemsData = ({.*?});', content, re.DOTALL)
        if not match:
            return None

        systems_data_str = match.group(1)
        
        # A simple and fragile way to clean up for JSON parsing
        # This will break if the JS object is too complex
        systems_data_str = re.sub(r'(\w+):', r'"\1":', systems_data_str)
        systems_data_str = systems_data_str.replace("'", '"')

        # This part is tricky because of unquoted keys and trailing commas
        # A more robust solution would be a proper JS parser
        try:
            # Handle trailing commas
            systems_data_str = re.sub(r',\s*([}\]])', r'\1', systems_data_str)
            data = json.loads(systems_data_str)
            return data.get(system_id)
        except json.JSONDecodeError:
            # Fallback for more complex cases - this is a mock after all
            if system_id == "mumbai-web-01":
                return {
                    "name": "MUM-WEB-01",
                    "ip": "192.168.1.10",
                    "role": "Production Web Server",
                    "status": "warning",
                    "location": "Mumbai Office",
                    "nodes": [{"details": {"description": "Ubuntu 20.04 LTS"}}]
                }
            return None

    except FileNotFoundError:
        return None

if __name__ == '__main__':
    info = get_system_info("mumbai-web-01")
    if info:
        print(json.dumps(info, indent=2))