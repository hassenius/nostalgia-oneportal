## Needed Libraries
import os
from flask import Flask, session, render_template, request
from flask.ext.session import Session

## Code for the session
app = Flask(__name__)
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

## Set the root folder
@app.route('/' )
def root():
  return render_template("index.html", title = 'Dashboard')
  
## Where the server will listen, and debug options
port = os.getenv('PORT', '5000')

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=int(port), threaded=True, debug=True)
