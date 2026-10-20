#!/usr/bin/env python3
"""
Verificador de sintaxe JavaScript para o projeto AVA.

Implementa um scanner léxico com os estados do ECMAScript
(código, string, template, regex, comentário) para detectar
erros estruturais: strings/templates não fechados, comentários
não terminados e delimitadores desbalanceados.

Uso:
    python tools/check_js.py assets/js
"""
import os
import sys


# Palavras reservadas que, antes de '/', indicam início de regex.
WORD_BEFORE_KEYWORDS = {
    'return', 'typeof', 'case', 'in', 'of', 'new', 'delete', 'void',
    'instanceof', 'do', 'else', 'yield', 'await', 'throw'
}

MATCH = {')': '(', ']': '[', '}': '{'}


class Scanner:
    def __init__(self, src):
        self.src = src
        self.i = 0
        self.n = len(src)
        self.line = 1
        self.stack = []
        self.prev = ''  # último caractere significativo

    def error(self, message, line=None):
        return (False, message, line if line is not None else self.line)

    def advance(self, count=1):
        for _ in range(count):
            if self.i < self.n:
                if self.src[self.i] == '\n':
                    self.line += 1
                self.i += 1

    def regex_allowed(self):
        prev = self.prev
        if prev == '':
            return True
        if prev in ')]}':
            return False
        if prev.isalnum() or prev in '_$':
            j = self.i - 1
            while j >= 0 and (self.src[j].isalnum() or self.src[j] in '_$'):
                j -= 1
            return self.src[j + 1:self.i] in WORD_BEFORE_KEYWORDS
        return True

    def scan_string(self, quote):
        self.advance()
        while self.i < self.n:
            c = self.src[self.i]
            if c == '\\':
                self.advance(2)
                continue
            if c == '\n':
                return self.error('string sem fechamento antes da quebra de linha')
            if c == quote:
                self.advance()
                self.prev = quote
                return None
            self.advance()
        return self.error('string não terminada')

    def scan_template(self):
        self.advance()
        while self.i < self.n:
            c = self.src[self.i]
            if c == '\\':
                self.advance(2)
                continue
            if c == '`':
                self.advance()
                self.prev = '`'
                return None
            if c == '$' and self.i + 1 < self.n and self.src[self.i + 1] == '{':
                err = self.scan_interpolation()
                if err:
                    return err
                continue
            self.advance()
        return self.error('template literal não terminado')

    def scan_interpolation(self):
        self.advance(2)
        depth = 1
        while self.i < self.n:
            c = self.src[self.i]
            if c == '`':
                err = self.scan_template()
                if err:
                    return err
                continue
            if c in ('"', "'"):
                err = self.scan_string(c)
                if err:
                    return err
                continue
            if c == '/' and self.i + 1 < self.n and self.src[self.i + 1] == '/':
                while self.i < self.n and self.src[self.i] != '\n':
                    self.advance()
                continue
            if c == '/' and self.i + 1 < self.n and self.src[self.i + 1] == '*':
                end = self.src.find('*/', self.i + 2)
                if end == -1:
                    return self.error('comentário de bloco não terminado')
                self.advance(end + 2 - self.i)
                continue
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    self.advance()
                    self.prev = '}'
                    return None
            self.advance()
        return self.error('interpolação ${ } não fechada')

    def scan_regex(self):
        self.advance()
        in_class = False
        while self.i < self.n:
            c = self.src[self.i]
            if c == '\\':
                self.advance(2)
                continue
            if c == '[':
                in_class = True
            elif c == ']':
                in_class = False
            elif c == '/' and not in_class:
                self.advance()
                while self.i < self.n and self.src[self.i].isalpha():
                    self.advance()
                self.prev = '/'
                return None
            elif c == '\n':
                return self.error('regex não terminado antes da quebra de linha')
            self.advance()
        return self.error('regex literal não terminado')

    def run(self):
        while self.i < self.n:
            c = self.src[self.i]

            if c in ' \t\r\n':
                self.advance()
                continue

            if c == '/' and self.i + 1 < self.n and self.src[self.i + 1] == '/':
                while self.i < self.n and self.src[self.i] != '\n':
                    self.advance()
                continue

            if c == '/' and self.i + 1 < self.n and self.src[self.i + 1] == '*':
                end = self.src.find('*/', self.i + 2)
                if end == -1:
                    return self.error('comentário de bloco não terminado')
                self.advance(end + 2 - self.i)
                continue

            if c in ('"', "'"):
                err = self.scan_string(c)
                if err:
                    return err
                continue

            if c == '`':
                err = self.scan_template()
                if err:
                    return err
                continue

            if c == '/' and self.regex_allowed():
                err = self.scan_regex()
                if err:
                    return err
                continue

            if c in '([{':
                self.stack.append((c, self.line))
                self.prev = c
                self.advance()
                continue

            if c in ')]}':
                if not self.stack:
                    return self.error("delimitador '%s' sem par de abertura" % c)
                opener, opened_line = self.stack.pop()
                if opener != MATCH[c]:
                    return self.error(
                        "delimitador '%s' na linha %d não corresponde a '%s' aberto na linha %d"
                        % (c, self.line, opener, opened_line))
                self.prev = c
                self.advance()
                continue

            self.prev = c
            self.advance()

        if self.stack:
            opener, opened_line = self.stack[-1]
            return self.error("delimitador '%s' aberto na linha %d nunca foi fechado"
                              % (opener, opened_line), opened_line)

        return (True, '', 0)


def check_file(path):
    with open(path, 'r', encoding='utf-8') as fh:
        src = fh.read()
    return Scanner(src).run()


def collect(targets):
    files = []
    for target in targets:
        if os.path.isfile(target):
            files.append(target)
        else:
            for root, _dirs, names in os.walk(target):
                for name in sorted(names):
                    if name.endswith('.js'):
                        files.append(os.path.join(root, name))
    return files


def main():
    targets = sys.argv[1:] or ['assets/js']
    files = collect(targets)
    if not files:
        print('Nenhum arquivo .js encontrado.')
        return 1

    failures = 0
    for path in files:
        ok, message, line = check_file(path)
        rel = path.replace('\\', '/')
        if ok:
            print('OK   %s' % rel)
        else:
            failures += 1
            print('FAIL %s -> %s (linha %d)' % (rel, message, line))

    print('\n%d arquivo(s) verificado(s), %d falha(s).' % (len(files), failures))
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
