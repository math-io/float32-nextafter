#!/usr/bin/env python
# coding: utf-8

"""Script to generate test data.

To run this script, navigate to the './test/fixtures' directory and run

$ python runner.py
"""

import numpy as np
import json


def gen(x, y, name):
    """Generate test data and write to file."""

    z = np.nextafter(x, y, dtype='float32')

    out = {
        'x': x.tolist(),
        'y': y.tolist(),
        'expected': z.tolist()
    }

    with open(name, 'w') as f:
        json.dump(out, f)


n = 500
r = np.random.random(n) - 0.5

# Normal values:
x = np.linspace(-100.0, 100.0, n, dtype='float32')
y = np.ones(n, dtype='float32')*1000.0
y[r < 0] *= -1
gen(x, y, 'normal.json')

# Negative subnormal values:
x = np.linspace(-1e-39, -1e-44, n, dtype='float32')
y = np.zeros(n, dtype='float32')
y[r < 0] = -1
gen(x, y, 'negative_subnormal.json')

# # Positive subnormal values:
x = np.linspace(1e-39, 1e-44, n, dtype='float32')
y = np.zeros(n, dtype='float32')
y[r > 0] = 1
gen(x, y, 'positive_subnormal.json')

# # Negative very large values:
x = np.linspace(-1e30, -1e37, n, dtype='float32')
y = np.zeros(n, dtype='float32')
y[r < 0] = -1e38
gen(x, y, 'negative_very_large.json')

# # Positive very large values:
x = np.linspace(1e30, 1e37, n, dtype='float32')
y = np.zeros(n, dtype='float32')
y[r > 0] = 1e38
gen(x, y, 'positive_very_large.json')

# Large values:
x = np.linspace(8388007, 8389007, n, dtype='float32')
y = np.zeros(n, dtype='float32')
y[r > 0] = 1e38
gen(x, y, 'positive_large.json')
