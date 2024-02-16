import unicodedata

def normalize(input_string):
    char_mapping = {
        ' ': '-',
        '_': '-',
    }

    normalized_string = unicodedata.normalize('NFD', input_string)
    normalized_string = ''.join([char_mapping.get(c, c) for c in normalized_string])
    normalized_string = ''.join([c for c in normalized_string if not unicodedata.combining(c)])

    return normalized_string.lower()
