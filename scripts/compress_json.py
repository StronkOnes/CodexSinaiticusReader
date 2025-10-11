
import gzip
import os
import shutil

def compress_json_files(input_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    for filename in os.listdir(input_dir):
        if filename.endswith(".json"):
            input_filepath = os.path.join(input_dir, filename)
            output_filepath = os.path.join(output_dir, f"{filename}.gz")
            
            with open(input_filepath, 'rb') as f_in:
                with gzip.open(output_filepath, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            print(f"Compressed {input_filepath} to {output_filepath}")

if __name__ == "__main__":
    base_data_dir = "/home/kobese/Projects - Personal/Codex_Sinaticus_Reader/data"

    # Compress KJV JSON files
    kjv_input_dir = os.path.join(base_data_dir, "kjv")
    kjv_output_dir = os.path.join(base_data_dir, "kjv_compressed")
    compress_json_files(kjv_input_dir, kjv_output_dir)

    # Compress Sinaiticus JSON files
    sinaiticus_input_dir = os.path.join(base_data_dir, "sinaiticus")
    sinaiticus_output_dir = os.path.join(base_data_dir, "sinaiticus_compressed")
    compress_json_files(sinaiticus_input_dir, sinaiticus_output_dir)
