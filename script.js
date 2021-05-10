let results = [];
let selectedUnit = 'microseconds';
let choosenPrecision = 10;

function getValue(id) {
    return parseInt(document.getElementById(id).value);
}

function calculateRAIDs() {
    const noOfDisks = getValue('no-of-disks');
    const transferRate = getValue('tranfer-rate');
    const stripSize = getValue('strip-size');
    
    const raid0Read = getValue('raid-0-read-size');
    const raid0Write = getValue('raid-0-write-size');
    const raid1Read = getValue('raid-1-read-size');
    const raid1Write = getValue('raid-1-write-size');

    const inputs = [
        noOfDisks, 
        transferRate, 
        stripSize, 
        raid0Read, 
        raid0Write, 
        raid1Read, 
        raid1Write
    ];

    [...inputs].forEach(item => {
        if(!item || isNaN(item)) {
            alert(`${item} is not a valid value`);
        }
    });

    $.getJSON("https://139.59.158.66/calc.php?v="+inputs.join(":"),function(data) {
        console.log({data});
        results = data.map(item => Number(item)/5);
        displayResults();
    });
    
    return false;
}

function getMultiplier() {
    switch(selectedUnit) {
        case 'nanoseconds':
            return (1000000000);
        case 'microseconds':
            return (1000000);
        case 'milliseconds':
            return (1000);
        case 'seconds':
            return 1;
        case 'minutes':
            return 0.0166667;
        case 'hours':
            return 0.000277778;
        default:
            return 1;
    }
}

function displayResults () {
    const multiplier = getMultiplier();
    let raid0ReadRes = results[0] ? results[0] * multiplier : 0;
    let raid0WriteRes = results[1] ? results[1] * multiplier : 0;
    let raid1ReadRes = results[2] ? results[2] * multiplier : 0;
    let raid1WriteRes = results[3] ? results[3] * multiplier : 0;

    if(Number(choosenPrecision) > 0 && Number(choosenPrecision) < 11) {
        raid0ReadRes = (raid0ReadRes).toFixed(choosenPrecision);
        raid0WriteRes = (raid0WriteRes).toFixed(choosenPrecision);
        raid1ReadRes = (raid1ReadRes).toFixed(choosenPrecision);
        raid1WriteRes = (raid1WriteRes).toFixed(choosenPrecision);
    } else {
        raid0ReadRes = (raid0ReadRes).toFixed();
        raid0WriteRes = (raid0WriteRes).toFixed();
        raid1ReadRes = (raid1ReadRes).toFixed();
        raid1WriteRes = (raid1WriteRes).toFixed();
    }

    const res = `<em><div><strong>RAID0-Read:</strong> ${raid0ReadRes} ${selectedUnit}<div>
            <div><strong>RAID0-Write:</strong> ${raid0WriteRes} ${selectedUnit}<div>
            <div><strong>RAID1-Read:</strong> ${raid1ReadRes} ${selectedUnit}<div>
            <div><strong>RAID1-Write:</strong> ${raid1WriteRes} ${selectedUnit}<div></em>`;
    $('#unit-input').val(selectedUnit);
    $('#precision-input').val(choosenPrecision);
    $('#result').html(res);
    $('#result-container').show('slow');
}

function changeResult(ctl) {
    selectedUnit = ctl.value;
    console.log(`Changing result to time unit: ${selectedUnit}`);
    displayResults();
}

function changePrecision(ctl) {
    if(!ctl.value || isNaN(ctl.value) || Number(ctl.value) < 0 || Number(ctl.value) > 10) {
        $('#precision-input').val(choosenPrecision);
        return;
    }

    choosenPrecision = Number(ctl.value);
    console.log(`Changing result with precision: ${choosenPrecision}`);
    displayResults();
}