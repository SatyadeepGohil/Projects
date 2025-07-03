import Seekr from "@satyadeep-gohil/seekr";
import Benchmark from 'benchmark';

function generateTestData(size) {
    const data = [];
    for (let i = 0; i < size; i++) {
        data.push({ name: `test${i}`, id: i });
    }
    return data;
}

const suite = new Benchmark.Suite;

const smallData = generateTestData(1000);
const largeData = generateTestData(100000);

suite
.add('Small Dataset - Exact Search', () => {
    new Seekr(smallData).search('test', 'name', { mode: 'exact'});
})
.add('Large Dataset - Exact Search', () => {
    new Seekr(largeData).search('test', 'name', { mode: 'exact'});
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run();