var _ = require("underscore");

var AspectCombiner = (function () {
    var module = {};

    module.matchAspects = function(list1, list2) {
        var result = [];
        for (var i = 0, val1; val1 = list1[i]; i++) {
            var bestMatch = [];
            var name;
            for (var j = 0, val2; val2 = list2[j]; j++) {
                var match = matchValues(val1, val2);
                if(match.length > bestMatch.length) {
                    bestMatch = match;
                    name = getCompositeName(val1.name, val2.name)
                }
            }
            result.push({name: name, aspects: bestMatch});
        }
        return result;
    };

    function getCompositeName(name1, name2) {
        if(name1 == name2)
            return name1;
        else
            return name1 + '/' + name2;
    }

    function matchValues(aspect1, aspect2) {
        var res = [];
        for (var i = 0, val1; val1 = aspect1.values[i]; i++) {
            for (var j = 0, val2; val2 = aspect2.values[j]; j++) {
                if (val1.name == val2.name) {
                    res.push(val1.name);
                    break;
                }
            }
        }
        return res;
    }

    return module;
}());

var createAspect = (name, valNames) => ({
    name: name,
    values: _.map(valNames, wrapName)
});
var wrapName = (val) => ({
    name: val
});

var ebayBrands = [
    'Acer',
    'Alienware',
    'AORUS',
    'ASUS',
    'Averatec',
    'Clevo',
    'CLEVO',
    'Compaq',
    'CTL',
    'CYBERPOWERPC',
    'Dell',
    'eMachines',
    'Everex',
    'Fujitsu',
    'Gateway',
    'Getac',
    'GIGABYTE',
    'Google',
    'Hannspree',
    'Hisense',
    'HP',
    'IBM',
    'iRulu',
    'Itronix',
    'Lenovo',
    'LG',
    'LXE',
    'MEDION',
    'Micron',
    'Microsoft',
    'Motion Computing',
    'Motorola',
    'MSI',
    'NEC',
    'OQO',
    'Origin PC',
    'Panasonic',
    'Razer',
    'Sager',
    'Samsung',
    'Sharp',
    'Sony',
    'Sylvania',
    'System76',
    'Systemax',
    'Toshiba',
    'Twinhead',
    'Unbranded/Generic',
    'ViewSonic',
    'VIZIO',
    'WinBook',
    'Not Specified'
];
var ebayProcessorTypes = [
    'AMD A10',
    'AMD A4 Dual-Core',
    'AMD A4 Quad-Core',
    'AMD A6 Dual-Core',
    'AMD A6 Quad-Core',
    'AMD A6 Tri-Core',
    'AMD A8',
    'AMD Athlon',
    'AMD Athlon 64',
    'AMD Athlon 64, 64 M',
    'AMD Athlon 64 FX',
    'AMD Athlon 64 X2',
    'AMD Athlon II',
    'AMD Athlon II Neo',
    'AMD Athlon II X2',
    'AMD Athlon Neo',
    'AMD Athlon Neo X2',
    'AMD Athlon X2',
    'AMD Athlon XP, XP-M',
    'AMD C-Series',
    'AMD Duron',
    'AMD E-Series',
    'AMD FX',
    'AMD Geode',
    'AMD K6',
    'AMD K7',
    'AMD Phenom',
    'AMD Phenom II X2',
    'AMD Phenom II X3',
    'AMD Phenom ll',
    'AMD Sempron',
    'AMD Turion 64',
    'AMD Turion 64 X2',
    'AMD Turion II',
    'AMD Turion Neo',
    'AMD Turion Neo X2',
    'AMD Turion X2',
    'AMD V-Series',
    'Intel Atom Dual-Core',
    'Intel Atom Quad-Core',
    'Intel Atom Single-Core',
    'Intel Celeron',
    'Intel Celeron D',
    'Intel Celeron M',
    'Intel Core 2 Duo',
    'Intel Core 2 Extreme',
    'Intel Core 2 Quad',
    'Intel Core 2 Solo',
    'Intel Core Duo',
    'Intel Core i3 1st Gen.',
    'Intel Core i3 2nd Gen.',
    'Intel Core i3 3rd Gen.',
    'Intel Core i3 4th Gen.',
    'Intel Core i3 5th Gen.',
    'Intel Core i3 6th Gen.',
    'Intel Core i5 1st Gen.',
    'Intel Core i5 2nd Gen.',
    'Intel Core i5 3rd Gen.',
    'Intel Core i5 4th Gen.',
    'Intel Core i5 5th Gen.',
    'Intel Core i5 6th Gen.',
    'Intel Core i7 1st Gen.',
    'Intel Core i7 2nd Gen.',
    'Intel Core i7 3rd Gen.',
    'Intel Core i7 4th Gen.',
    'Intel Core i7 5th Gen.',
    'Intel Core i7 6th Gen.',
    'Intel Core M',
    'Intel Core Solo',
    'Intel Itanium',
    'Intel Mobile Celeron',
    'Intel Pentium',
    'Intel Pentium 4',
    'Intel Pentium 4 HT',
    'Intel Pentium 4 M',
    'Intel Pentium D',
    'Intel Pentium Dual-Core',
    'Intel Pentium II',
    'Intel Pentium III',
    'Intel Pentium III E',
    'Intel Pentium III Mobile',
    'Intel Pentium II Mobile',
    'Intel Pentium M',
    'Intel Pentium MMX',
    'Intel Pentium Mobile',
    'Intel Pentium N-Series',
    'Intel Pentium Pro',
    'Intel Xeon',
    'NVIDIA Tegra 3',
    'NVIDIA Tegra 4',
    'NVIDIA Tegra K1',
    'Samsung Exynos 5 Dual',
    'Transmeta Crusoe',
    'VIA C3',
    'VIA C7',
    'VIA Nano',
    'Not Specified'
];
var mlMarcas = [
    'HP',
    'Dell',
    'Positivo',
    'Acer',
    'Lenovo',
    'Asus',
    'CCE',
    'Sony',
    'Toshiba',
    'Samsung',
    'Compaq',
    'Itautec',
    'LG',
    'MSI',
    'Semp Toshiba',
    'Philco',
    'Intelbras',
    'Avell',
    'Gateway',
    'Microboard',
    'Alienware',
    'Qbex',
    'Megaware',
    'Outras Marcas'
];
var mlProcessadores = [
    'Intel Core I5',
    'Intel Core I3',
    'Intel Core I7',
    'Intel Celeron',
    'Intel Core 2 Duo',
    'AMD Turion 64 X2',
    'Intel Core Duo',
    'AMD A-Series',
    'Intel Centrino',
    'AMD Sempron',
    'AMD C-Series',
    'AMD E-Series',
    'Intel Atom',
    'AMD Athlon II',
    'AMD Athlon',
    'AMD Vision',
    'Outros Processadores'
];

var ebayLaptops = {
    name: 'PC Laptops & Notebooks',
    aspects: [
        createAspect('Brands', ebayBrands),
        createAspect('Processor Types', ebayProcessorTypes)
    ]
};
var mlLaptops = {
    name: 'Notebook',
    aspects: [
        createAspect('Marcas', mlMarcas),
        createAspect('Processadores', mlProcessadores)
    ]
};


function test() {
    var res = AspectCombiner.matchAspects(ebayLaptops.aspects, mlLaptops.aspects);
    console.log(res);
}

test();
