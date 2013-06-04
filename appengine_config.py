import sys

if 'libs' not in sys.path:
    # Add libs as primary libraries directory
    sys.path[0:0] = ['server', ]
