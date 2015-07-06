## Morse test
You can generate some input signals (dot's and dashes), and depending on their duration, decodes dot's and dashes in letters and after that combines them in words.

### [http://alexmost.github.io/morse/](http://alexmost.github.io/morse/)

This project aims to highlight the power of FRP approach for working with async logic (Rx.js lib). At the very low level we have streams from DOM events (keyup, keydown, mouseup, mousedown), which were composed to receive more meaningful and more valuable streams such as dot's, dashes and spaces between them, and those are also were used to get letters and words. As a result, at the very high level we have streams with words and letters, that can be used in UI. This example show's how we can build applications with complex async logic in simple and elegant way. Each async operation is represented as simple stream for building more complex streams. We can work with letters and words streams as with simple collection and assign some more logic on top of them (Try to type SOS or CAT).

## Some tech details

### Morse logic
1. Letters are sequences of dot's, dashes and spaces between them.
2. Space between letters are equal nearly 3 dot's.
3. Space between words equals nearly 7 dot's.
