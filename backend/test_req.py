import urllib.request
try:
    req = urllib.request.urlopen('http://127.0.0.1:8000/api/map')
    print(req.read().decode('utf-8')[:500])
except Exception as e:
    print(e)
