class Reporter  {
    constructor() {
        this.date = new Date().toISOString();
        this.TestsListAll = []; // массив всех тестов
        this.TestsListFailed = []; // массив проваленных тестов
    }
  
    onBegin(config, suite) { // выполнится в начале тест-рана
        console.log(`Starting the run with ${suite.allTests().length} tests`);
    }
  
    onTestBegin(test) { // выпорлнитсчя в начале каждого тест-кейса
        console.log(`Starting test ${test.title}`);
    }
  
    onTestEnd(test, result) { // Выполнится в конце каждого тест-кейса
        console.log(`Finished test ${test.title}: ${result.status}`);
  
        let error; 
        if (result.error) { // если ошибка в тесте есть, он запишет в error всю информацию об ошибке, предварительно очистив от лишних симовлов
            error = result.error.message.replace(/\x1B\[\d+m/g, '');
        } else {
            error = false; // если ошибки нет в кейсе, будет false
        }
  
        const testCase = { // информация о тесте
            title: `${test.parent.title} | ${test.title}`,
            status: result.status,
            error: error
        }
  
        this.TestsListAll.push(testCase); // добавляем кейс в ошбий список тестов
        if (error) { // если ошибка есть, добавить также в массив проваленных
            this.TestsListFailed.push(testCase)
        }
    }
  
    async onEnd(result) { // выполнится в конце всего тест-рана
        console.log(`Finished the run: ${result.status}`);
  
        const TestRunResults = { // результаты всего рана 
            date: this.date,
            status: result.status,
            testsCount: this.TestsListAll.length,
            testListAll: this.TestsListAll,
            testListFailed: this.TestsListFailed,
        }
  
        console.log(TestRunResults) // дамп для дебага, он не нужен тут
  
        // Отправляем результаты с помощью встроенного HTTP-модуля
        const http = require('http');
        const options = {
          hostname: 'your-server-hostname',
          port: 80,
          path: '/your-endpoint',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
  
        const req = http.request(options, (res) => {
          console.log(`statusCode: ${res.statusCode}`);
          console.log('Results sent successfully');
        });
  
        req.on('error', (error) => {
          console.error(error);
          console.log('Error sending results:', error);
        });
  
        req.write(JSON.stringify(TestRunResults));
        req.end();
  
        console.log('Reporter finished');
        process.exit(0);
    }
  }
  
  module.exports = Reporter;