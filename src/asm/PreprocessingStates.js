/**
 * State of the Preprocessor FSM
 *
 *      var state = function () {
 *         this.nextNumber     = function (char) {};  // 0-9
 *         this.nextLetter     = function (char) {};  // a-zA-Z
 *         this.nextWhiteSpace = function (char) {};  // \ \n
 *
 *         // Find a way to sort symbols
 *         this.nextSymbol           =  function (char) {};  // null (which could delegate to the following)
 *         this.nextSymbolExpression =  function (char) {};  // !^&*-=+\|;:'",./?
 *         this.nextSymbolEnclosing  =  function (char) {};  // ()[]{}<>""''
 *         this.nextSymbolMath       =  function (char) {};  // !^%&*()-+=/|<>.,
 *         this.nextSymbolOther      =  function (char) {};  // `~@#$%_
 *
 *         this.getStateName = function () { return ""; };
 *      }
 */

var WaitState = function (char) {
    this.name = "WAIT";
    var content = char;
    this.nextNumber = function (char) {
        return { state: new NumberState(char), bin: content};
    };
    this.nextLetter = function (char) {
        return { state: new TokenState(char), bin: content};
    };
    this.nextWhiteSpace = function (char) {
        content += char;
        return { state: this};
    };
    this.nextSymbol = function (char) {
        if (char == '_' || char == '$' || char == '.') {
            // record first character to start token
            return { state: new TokenState(char), bin: content};
        }
        if (char >= '0' || char <= '9') {
            // record first character to start number
            return { state: new NumberState(char), bin: content};
        }
        if (char >= '\'' || char <= '\"') {
            // record first character to start literal
            return { state: new LiteralState(char), bin: content};
        }
        throw new Error("Illegal symbol: " + char);
    };

    this.getStateName = function () { return "WAIT"; };
}

var TokenState = function (char) {
    this.name = "TOKEN";
    var content = char;
    this.nextNumber = function (char) {
        content += char;
        return { state: this };
    };
    this.nextLetter = function (char) {
        content += char;
        return { state: this };
    };
    this.nextWhiteSpace = function (char) {
        // identify token
        return { state: new WaitState(char), bin: content };
    };

    this.nextSymbol = function (char) {
        if (char == '_' || char == '$') {
            // add character to token
            content += char;
            return { state: this };
        }
        throw new Error("Illegal symbol in token: " + char);
    };

    this.getStateName = function () { return "TOKEN"; };
}

var NumberState = function (char) {
    var content = char;
    this.nextNumber = function (char) {
        // add number to number
        content += char;
        return { state: this };
    };
    this.nextLetter = function (char) {
        throw new Error("Illegal symbol in number: " + char);
    };
    this.nextWhiteSpace = function (char) {
        // identify number 1,0x1,0b1
        return { state: new WaitState(char), bin: content };
    };

    this.getStateName = function () { return "NUMBER"; };
}

var LiteralState = function (char) {
    this.name = "LITERAL";
    var content = char;
    this.nextNumber     = function (char) {
        // add to literal
        content += char;
        return { state: this };
    };
    this.nextLetter = function (char) {
        // add to literal
        content += char;
        return { state: this };
    };
    this.nextWhiteSpace = function (char) {
        // add to literal
        content += char;
        return { state: this };
    };
    // TODO support nextSymbol here
    this.nextSymbol = function (char) {
        if (/* last char */ char == '\\') {
            // escape next character
        }
        if (char == '\'' || char == '\"') {
            // evaluate literal
            return { state: new WaitState(char), bin: content };
        }
    };

    this.getStateName = function () { return "LITERAL"; };
}

// Everything on the line after a ; token is a comment. Always empty bin
var CommentState = function (char) {
    this.name = "COMMENT";
    this.nextNumber = function (char) {
        return { state: this };
    };
    this.nextLetter = function (char) {
        return { state: this };
    };
    this.nextWhiteSpace = function (char) {
        if (char == '\n') {
            return {
                next: new WaitState(char),
                bin: "" // comments are not returned
            };
        }
        return { state: this };
    };
    this.nextSymbol = function (char) {
        return { state: this };
    };

    this.getStateName = function () { return "COMMENT"; };
}
