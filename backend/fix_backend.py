import re

with open('main_backup.py', 'r') as f:
    content = f.read()

with open('retail_backend.py', 'r') as f:
    retail_code = f.read()

# Insert retail code right before @app.get("/api/map")
new_content = content.replace('@app.get("/api/map")', retail_code + '\n\n@app.get("/api/map")')

with open('main.py', 'w') as f:
    f.write(new_content)

