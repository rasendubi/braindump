import { parse } from './parser';
import YAML from 'yaml';
import { Type } from 'yaml/util';

YAML.scalarOptions.str.defaultType = Type.QUOTE_DOUBLE;
YAML.scalarOptions.str.defaultKeyType = Type.PLAIN;

expect.addSnapshotSerializer({
  test(value) {
    try {
      YAML.stringify(value);
      return true;
    } catch (e) {
      return false;
    }
  },
  print(value) {
    return YAML.stringify(value).trimEnd();
  },
});

const itParses = (name: string, input: string) => {
  it(name, () => {
    const result = parse(input);
    expect(result).toMatchSnapshot();
  });
};
itParses.only = (name: string, input: string) => {
  it.only(name, () => {
    const result = parse(input);
    expect(result).toMatchSnapshot();
  });
};
itParses.skip = (name: string, input: string) => {
  it.skip(name, () => {
    const result = parse(input);
    expect(result).toMatchSnapshot();
  });
};
itParses.todo = (name: string, _input?: string) => {
  it.todo(name);
};

describe('org/parser', () => {
  itParses('empty document', '');

  describe('headline', () => {
    itParses('single headline', '* Hello');

    itParses(
      'multiple headlines',
      `* Hello
* World
* blah`
    );

    itParses(
      'nested headlines',
      `* hi
** there
*** how
* are
*** you
`
    );

    itParses(
      'complex headline',
      `* TODO [#A] COMMENT headline /italic/ title :some:tags:`
    );
  });

  describe('section', () => {
    itParses(
      'initial section',
      `hello
* hi`
    );

    itParses('single-line section', `hi`);

    itParses(
      'empty lines before first section',
      `

hi`
    );

    itParses(
      'section in headline',
      `* hello
this is section`
    );
  });

  itParses('keyword', `#+title: hi`);

  itParses(
    'planning',
    `* headline
CLOSED: [2019-03-13 Wed 23:48] SCHEDULED: [2019-03-13 Wed] DEADLINE: [2019-03-14 Thu]`
  );

  itParses(
    'property drawer',
    `* headline
:PROPERTIES:
:CREATED: [2019-03-13 Wed 23:57]
:END:`
  );
  itParses(
    'property drawer + section',
    `* headline
:PROPERTIES:
:CREATED: [2019-03-13 Wed 23:57]
:END:
hello`
  );

  itParses(
    'custom drawer',
    `:MYDRAWER:
hello /there/
:END:`
  );

  describe('timestamps', () => {
    itParses('inactive', `[2021-01-07 Thu]`);
    itParses('inactive-range', `[2021-01-07 Thu]--[2021-01-08 Fri]`);
    itParses('active', `<2021-01-07 Thu>`);
    itParses('active-range', `<2021-01-07 Thu>--<2021-01-09 Sat>`);
    itParses('with time', `[2021-01-07 Thu 19:36]`);
    itParses('time range', `[2021-01-07 Thu 19:36-20:38]`);
    itParses.todo('diary');
  });

  describe('list', () => {
    itParses('single-item list', `- hi`);

    itParses(
      'two-item list',
      `- hi
- there`
    );

    itParses(
      'ordered list',
      `1. one
2. two`
    );

    itParses(
      'nested lists',
      `- there
  - nested
  - list`
    );

    itParses(
      'list after paragraph',
      `hello
- list`
    );

    itParses(
      'two empty lines breaking list',
      `- list1


- list 2`
    );

    itParses(
      'empty line between list items',
      `- item 1

- item 2`
    );

    itParses('fake list numbers', `- 1. blah`);
  });

  describe('links', () => {
    itParses('link', `http://example.com`);

    itParses('link mixed with text', `hello http://example.com blah`);

    itParses('regular link', `[[link][text]]`);

    itParses('regular link with longer link slash', `[[longlink][text]]`);

    itParses('two links in one line', `[[link1][text1]] [[link2][text2]] `);

    itParses('link after text', `some text [[link][text]]`);

    itParses('link with no text', `[[link]]`);
  });

  describe('blocks', () => {
    itParses(
      'src block',
      `#+begin_src
hello
#+end_src`
    );

    itParses(
      'escaper in src block',
      `#+begin_src c
,*a = 0;
#+end_src`
    );

    itParses(
      'src in list',
      `
- example:
  #+begin_src
  blah
  #+end_src`
    );

    itParses(
      'quote block',
      `#+begin_quote
hello
#+end_quote`
    );

    itParses(
      'verse block',
      `#+BEGIN_VERSE
 Great clouds overhead
 Tiny black birds rise and fall
 Snow covers Emacs

    ---AlexSchroeder
#+END_VERSE`
    );

    itParses(
      'center block',
      `#+begin_center
hello
#+end_center`
    );

    itParses(
      'comment block',
      `#+begin_comment
hello
#+end_comment`
    );

    itParses(
      'special block',
      `#+begin_blah
hello
#+end_blah`
    );
  });

  describe('emphasis marks', () => {
    itParses('bold', `*hello*`);

    itParses('emphasis', `/Consider/ ~t*h*e~ *following* =example= +strike+`);

    itParses('C++ accidental strike-through', `C++ blah C++`);

    itParses('emphasis boundaries', `a/a/ b*b* c~c~ d=d= e+e+ f_f_`);

    itParses('hanging /', `- hello/other`);
  });

  itParses(
    'table',
    `
| head1  | head2 |
|--------+-------|
| value1 | value2 |
`
  );
});
