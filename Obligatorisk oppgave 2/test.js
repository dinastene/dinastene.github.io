//sett standardverdier før testene kjøres.
QUnit.testStart(function() {
    numbers = [5, 1, 6, 2];
    inputValue = 0;
    chosenBar = null;
    show();
});
QUnit.module('chooseBar', function() {
    QUnit.test('when a chosen bar is chosen again, it should no longer be marked.', function(assert) {
        chooseBar(3);
        chooseBar(3);
        assert.equal(chosenBar, null);
        assert.equal(document.getElementsByClassName('markedBar').length, 0);
    });

    QUnit.test('when a bar is chosen, it should be marked.', function(assert) {
        chooseBar(3);
        assert.equal(chosenBar, 3);
        assert.equal(document.getElementsByClassName('markedBar').length, 1);
    });

    QUnit.test('when chosing an invalid bar, no bars should be marked.', function(assert) {
        chooseBar(5);
        assert.equal(chosenBar, null);
        assert.equal(document.getElementsByClassName('markedBar').length, 0);
        chooseBar(0);
        assert.equal(chosenBar, null);
        assert.equal(document.getElementsByClassName('markedBar').length, 0);
    });

    QUnit.test('when two different bars are chosen, only the last should be marked.', function(assert) {
        chooseBar(3);
        chooseBar(1);
        assert.equal(chosenBar, 1);
        assert.equal(document.getElementsByClassName('markedBar').length, 1);
    });

    QUnit.test('when bar is chosen, the buttons for change and remove is enabled', function(assert) {
        chooseBar(2);
        assert.false(document.getElementById("noclickyclick").disabled);
        assert.false(document.getElementById("noclick").disabled);
    });

    QUnit.test('when no bar is chosen, the buttons for change and remove is disabled', function(assert) {
        assert.true(document.getElementById("noclickyclick").disabled);
        assert.true(document.getElementById("noclick").disabled);
    });
});

QUnit.module('deleteBar', function() {
    QUnit.test('when bar is deleted the bars number is removed from numbers-array', function(assert) {
        //testing av slett stolpe som er i midten.
        chooseBar(3);
        deleteBar();
        assert.equal(numbers.length, 3);
        assert.false(numbers.includes(6));
        //testing av slett stolpe som er først.
        chooseBar(1);
        deleteBar();
        assert.equal(numbers.length, 2);
        assert.false(numbers.includes(5));
        //testing av slett stolpe som er sist.
        chooseBar(2);
        deleteBar();
        assert.equal(numbers.length, 1);
        assert.false(numbers.includes(2));
    });

    QUnit.test('when a bar is deleted none bars are marked.', function(assert) {
        chooseBar(3);
        deleteBar();
        assert.equal(chosenBar, null);
        assert.equal(document.getElementsByClassName('markedBar').length, 0);
    });

    QUnit.test('when trying to delete a invalid bar no bars should be deleted.', function(assert) {
        chosenBar = 5;
        deleteBar();
        assert.equal(numbers.length, 4);
        assert.deepEqual(numbers, [5, 1, 6, 2]);
    });

    QUnit.test('when trying to delete with no bars marked no bars should be deleted.', function(assert) {
        deleteBar();
        assert.equal(numbers.length, 4);
    });

    QUnit.test('when a bar is deleted all other bars is moved left', function(assert) {
        //rekkefølgen på stolpene er basert på numbers-array, derfor sjekker vi bare at rekkefølgen er som forventet.
        chooseBar(3);
        deleteBar();
        assert.deepEqual(numbers, [5, 1, 2]);
    });
});

QUnit.module('changeBar', function() {
    QUnit.test('when a bar is chosen and the input value is valid, the bar should be updated with input value.', function(assert) {
        inputValue = 4;
        chooseBar(3);
        changeBar();
        assert.deepEqual(numbers, [5, 1, 4, 2]);
        assert.equal(document.getElementById("warning").innerHTML, "");
    });

    QUnit.test('when a valid change is done the bar should still be marked.', function(assert) {
        inputValue = 4;
        chooseBar(3);
        changeBar();
        assert.equal(chosenBar, 3);
        assert.equal(document.getElementsByClassName('markedBar').length, 1);
    });
    
    QUnit.test('when input value is invalid should get a error message.', function(assert) {
        inputValue = 11;
        chooseBar(3);
        changeBar();
        assert.equal(document.getElementById("warning").innerHTML, "Value has to be between 0 and 10");
    });

    QUnit.test('when input value is invalid should not update bar.', function(assert) {
        inputValue = 11;
        chooseBar(3);
        changeBar();
        assert.deepEqual(numbers, [5, 1, 6, 2]);
    });

    QUnit.test('when input value is valid but chosen bar is invalid should not update bar.', function(assert) {
        inputValue = 5;
        chosenBar = 5;
        changeBar();
        assert.deepEqual(numbers, [5, 1, 6, 2]);
    });
});

QUnit.module('createBar', function() {
    QUnit.test('when input value is valid should create a new bar to far right.', function(assert) {
        inputValue = 3;
        createBar();
        assert.deepEqual(numbers, [5, 1, 6, 2, 3]);
        assert.equal(document.getElementById("warning").innerHTML, "");
    });

    QUnit.test('when input value is invalid should get a error message.', function(assert) {
        inputValue = 11;
        createBar();
        assert.equal(document.getElementById("warning").innerHTML, "Value has to be between 0 and 10");
    });

    QUnit.test('when input value is invalid should not create a new bar.', function(assert) {
        inputValue = 11;
        createBar();
        assert.deepEqual(numbers, [5, 1, 6, 2]);
        inputValue = 0;
        createBar();
        assert.deepEqual(numbers, [5, 1, 6, 2]);
    });
});