import sys, re, io

base = r'c:\Users\Andrade\OneDrive\Filmes\OneDrive\Documentos\AVA'

def dump(src, dst, a, b):
    L = open(base + '\\' + src, encoding='utf-8').read().split('\n')
    open(base + '\\' + dst, 'w', encoding='utf-8').write('\n'.join(L[a:b]))

def keys(src, dst):
    s = open(base + '\\' + src, encoding='utf-8').read()
    out = [m.group(1) for m in re.finditer(r'^    (\w+):', s, re.M)]
    open(base + '\\' + dst, 'w', encoding='utf-8').write('\n'.join(out))

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'keys':
        keys(sys.argv[2], sys.argv[3])
    else:
        dump(sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]))
