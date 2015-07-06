## Morse test 
### try here - [http://alexmost.github.io/morse/](http://alexmost.github.io/morse/)

You can generate some input signals (dots and dashes), and depending on their duration, this app will transform dots and dashes in letters and combine them in words.

This project aims to highlight the power of FRP approach for working with async logic (Rx.js lib). At the very low level we have streams from DOM events (keyup, keydown, mouseup, mousedown), which are composed to receive more meaningful and more valuable streams such as dots, dashes and spaces, and those are also used to get letters and words. As a result, at the very high level we have streams with words and letters that can be used in UI. We can work with letters and words streams as a simple collections and even more - build more logic on top of them (Try to type SOS or CAT). For deeper details just look at the source =)


### Morse logic
1. Letters are sequences of dots, dashes and spaces between them.
2. Space between letters are equal nearly 3 dots.
3. Space between words equals nearly 7 dots.
