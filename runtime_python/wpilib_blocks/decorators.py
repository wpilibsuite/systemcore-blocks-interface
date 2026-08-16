
# For now this does nothing but it lets the decorator work
def Teleop(cls):
    return cls

def Auto(cls):
    return cls

def Utility(cls):
    return cls

def Name(cls, str):
    return cls

def Group(cls, str):
    return cls
