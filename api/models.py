import urllib2
from StringIO import StringIO
from PIL import Image
from hashlib import md5
from datetime import datetime

# Load column data types
from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, ForeignKey

# Relationship features
from sqlalchemy.orm import relationship, backref, deferred
from sqlalchemy import event # For event.listens_for decorator

import json


# Import types

# Define models.
# For multiple-file organization, look at: http://stackoverflow.com/questions/19644898/change-in-import-handling-modules-from-python2-to-python3

""" Serialization:

Interesting serialization approaches: http://stackoverflow.com/questions/7102754/jsonify-a-sqlalchemy-result-set-in-flask

Frankly, just do

    def serialize(self):
        return {
            'attr': self.attr,
            'many2many': [ item.serialize for item in self.many2many ],
            'modified': self.modified.isoformat(),
            ...
        }

    Fucking done. God. Go away with your automatic generators.

    Then a setter would just be:

    idk. Some shit. It would need to validate and concat validation stuff as it sets. Chain of catch blocks I guess? Not
    very pythonic.

"""
