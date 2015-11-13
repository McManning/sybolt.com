
from datetime import datetime
import xml.etree.ElementTree as ElementTree

def pretty_date(t = False):
    """
    Get a datetime object or a int() Epoch timestamp and return a
    pretty string like 'an hour ago', 'Yesterday', '3 months ago',
    'just now', etc
    """
    now = datetime.now()

    # holy jesus balls this datetime conversion is trash and hacky PLZ FIX @TODO OH GOD
    diff = now - datetime(*t[:7])

    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 10:
            return "just now"
        if second_diff < 60:
            return str(second_diff) + " seconds ago"
        if second_diff < 120:
            return "a minute ago"
        if second_diff < 3600:
            return str(second_diff / 60) + " minutes ago"
        if second_diff < 7200:
            return "an hour ago"
        if second_diff < 86400:
            return str(second_diff / 3600) + " hours ago"
    if day_diff == 1:
        return "Yesterday"
    if day_diff < 7:
        return str(day_diff) + " days ago"
    if day_diff < 31:
        return str(day_diff / 7) + " weeks ago"
    if day_diff < 365:
        return str(day_diff / 30) + " months ago"
    return str(day_diff / 365) + " years ago"
        
def parse_rtmp_status(http_response):
    """
        Parses a response from the RTMP status service and
        returns a JSON representation of the new status.
    """
    json = dict()

    # Parse the status into something we can serve as JSON
    try:
        root = ElementTree.fromstring(http_response)
    except:
        json['error'] = 'Error parsing status XML'
        return json

    # Assumption is that there is only one application (live)
    # running (for now) as I don't have the bandwidth to 
    # support more
    app = root.find('server').find('application')
    
    stream = app.find('live').find('stream')
    if stream is not None:
        # stream.find('name') is the Stream Key from OBS (current set to "test")
        # Eventually, this'll be some sort of identifier for who's streaming.
        json['stream_path'] = stream.find('name').text
        json['publishing'] = (stream.find('publishing') != None)
        
        # Video/Audio statistics
        meta = stream.find('meta')
        if meta != None:
            video = stream.find('meta').find('video')
            audio = stream.find('meta').find('audio')
            
            json['video'] = dict(
                width=video.find('width').text,
                height=video.find('height').text,
                frame_rate=video.find('frame_rate').text,
                codec=video.find('codec').text
                # Not included: profile, compat, level
            )
            
            json['audio'] = dict(
                codec=audio.find('codec').text,
                profile=audio.find('profile').text,
                channels=audio.find('channels').text,
                sample_rate=audio.find('sample_rate').text
            )
        
        # Current clients watching or publishing
        json['clients'] = []
        
        count = 0
        for client in stream.findall('client'):
            if client.find('publishing') != None:
                # If we found the streamer himself, log it separately
                # @todo link with a Sybolt Profile if possible
                json['publisher'] = dict(
                    ip = client.find('address').text
                )
            else:
                # Log a watcher
                # @todo link with a Sybolt Profile if possible
                json['clients'].append(dict(
                    ip = client.find('address').text
                ))
    else: # if !stream
        # The stream is just completely dead (no viewers, no publishers)
        json['publishing'] = False

    return json
