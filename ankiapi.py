import requests
import json

HOSTNAME = 'ankiot.opcau.com'
PORT = '7830'
CARS = {
    1: 'Guardian',
    2: 'Ground Shock',
    3: 'Thermo',
    4: 'Skull',
}

# Abstracted GET request
def ANKI_GET(endpoint):
    global HOSTNAME, PORT
    resp = requests.get('http://{}:{}/{}/'.format(HOSTNAME, PORT, endpoint))
    print(resp)
    resp = json.loads(resp.text)
    return resp

# Abstracted POST request
def ANKI_POST(endpoint):
    global HOSTNAME, PORT
    resp = requests.post('http://{}:{}/{}/'.format(HOSTNAME, PORT, endpoint))
    resp = json.loads(resp.text)
    return resp

# Checks the status of the car id
def check_car(id):
    if id not in CARS:
        print('Id not found!')
        return
    return ANKI_POST('connect/' + CARS[id])

# Changes car lanes
def go_left(id):
    if id not in CARS:
        print('Id not found!')
        return
    # -68 is far left lane
    return ANKI_POST('changeLanes/' + CARS[id] + '-68')

def go_right(id):
    if id not in CARS:
        print('Id not found!')
        return
    # 68 is far right lane
    return ANKI_POST('changeLanes/' + CARS[id] + '68')

def go_centre(id):
    if id not in CARS:
        print('Id not found!')
        return
    return ANKI_POST('changeLanes/' + CARS[id] + '0')
