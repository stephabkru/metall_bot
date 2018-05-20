"use strict";

// VK Bot API
const API = require('node-vk-bot-api');
const bot = new API('c56be09d0b308929f819fd5c7e76dd0d5fac317e08cf1753796d1eb4567ff972aea927f0677dc5f42797e');
const request = require('request'); 

// Load models
const Subject = require('./models/subject.js');
const Theme   = require('./models/theme.js');
const User    = require('./models/user.js');
const Questions  = require('./models/questions.js');


const CODE = 'Металл';
const headers = {
	'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/json'
};

const data_main = [
	{
		i: '1',
		text: 'Ст0',
		value: 'Ст0'
	},
	{
		i: '2',
		text: 'Ст1кп',
		value: 'Ст1кп'
	},
	{
		i: '3',
		text: 'Ст1пс',
		value: 'Ст1пс'
	},
	{
		i: '4',
		text: 'Ст1сп',
		value: 'Ст1сп'
	},
	{
		i: '5',
		text: 'Ст2кп',
		value: 'Ст2кп'
	},
	{
		i: '6',
		text: 'Ст2пс',
		value: 'Ст2пс'
	},
	{
		i: '7',
		text: 'Ст2сп',
		value: 'Ст2сп'
	},
	{
		i: '8',
		text: 'Ст3кп',
		value: 'Ст3кп'
	},
	{
		i: '9',
		text: 'Ст3пс',
		value: 'Ст3пс'
	},
	{
		i: '10',
		text: 'Ст3сп',
		value: 'Ст3сп'
	},
	{
		i: '11',
		text: 'Ст4кп',
		value: 'Ст4кп'
	},
	{
		i: '12',
		text: 'Ст4пс',
		value: 'Ст4пс'
	},
	{
		i: '13',
		text: 'Ст4сп',
		value: 'Ст4сп'
	},
	{
		i: '14',
		text: 'Ст5пс',
		value: 'Ст5пс'
	},
	{
		i: '15',
		text: 'Ст5сп',
		value: 'Ст5сп'
	},
	{
		i: '16',
		text: '05кп',
		value: '05кп'
	},
	{
		i: '17',
		text: '08кп',
		value: '08кп'
	},
	{
		i: '18',
		text: '08пс',
		value: '08пс'
	},
	{
		i: '19',
		text: '10пс',
		value: '10пс'
	},
	{
		i: '20',
		text: '20пс \n\n Выберите пожалуйста желаемый список признаков для выбранных ранее объектов:',
		value: '20пс'
	},
	{
		i: 'A',
		text: 'Способ раскисления',
		value: 'Способ раскисления'
	},
	{
		i: 'B',
		text: "Характеристика качества",
		value: 'Характеристика качества'
	},
	{
		i: 'C',
		text: 'Содержание легирующих элементов',
		value: 'Содержание легирующих элементов'
	},
	{
		i: 'D',
		text: 'Минимальная доля углерода в процентах',
		value: 'Минимальная доля углерода в процентах'
	},
	{
		i: 'E',
		text: 'Максимальная доля углерода в процентах',
		value: 'Максимальная доля углерода в процентах'
	}
];


// Step 1
const stepStart = function(user, message) {


	let answer = "Добрый день.\n Я являюсь чат-ботом, созданным для тестирования знаний в области металлообработки.\n Пожалуйста, введите кодовое слово, которое Вам должен был сообщить руководитель.";

	user.step = 'code';
	user.save(function(err) {

	});
	
	bot.reply(user.user_id, answer);

}

// Step 2
const stepCode = function(user, message) {

	let answer = "";
	console.log(user);

	if (message == CODE) {

		user.step = 'pretest';
		user.save();

		let answer = "Отлично! Теперь Вам нужно выбрать набор из объектов, признаков и количества вопросов.\n С помощью Вашего выбора мы подберем для Вас персональный тест. \n Пример ответа на этот вопрос можете посмотреть в примечании в конце сообщения.\n\nНебольшие правила тестирования:\n1. У Вас есть только одна попытка правильно ответить на вопрос\n2. Вы не можете выйти из тестирования до его окончания\n3. После тестирования Вы сможете посмотреть процент правильных ответов, а также составить новый тест\n\n Выберите желаемый список объектов:\n";

		data_main.forEach(function(item, i, arr) {

			answer = answer + item.i + ". " + item.text + "\n";

		});


		answer = answer + "\n Пример того, как может выглядить запрос: 1,2:A,B:5\nИсходя из данного запроса составится тест на объекты Ст4ст, 05кп, вопросы будут на тему их максимальной доли углерода и способа раскисления. Количество вопросов в тесте будет равно пяти";

		bot.reply(user.user_id, answer);


	} else {

		bot.reply(user.user_id, 'Похоже, что Вы неверно ввели код. Введите кодовое слово заново.');

	}


}


const stepPretest = function(user, message) {

	

	try {

		let buffer = message.split(':');

		let objects = buffer[0].split(',');
		for (var j = objects.length - 1; j >= 0; j--) {
			for (var i = data_main.length - 1; i >= 0; i--) {
				if (data_main[i].i == objects[j]) objects[j] = data_main[i].value;
			}
		}

		let attributes = buffer[1].split(',');
		for (var j = attributes.length - 1; j >= 0; j--) {
			for (var i = data_main.length - 1; i >= 0; i--) {
				if (data_main[i].i == attributes[j]) attributes[j] = data_main[i].value;
			}
		}

		let count = parseInt(buffer[2]) || 10;


		let _ru = {
			author: "Author",
			creation_date: "01.01.1970",
			version: "1.00",
			guid: "2E7E22F4-5B51-4948-B120-AB21F08317DB",
			test_requirements: {
				count: count*2,
				question_type: ["O>A"],
				answer_form: ["binary"],
				entities1: objects,
				entities2: attributes

			}
		}; 


	var options = {
    	url: 'http://test-generator-api.herokuapp.com/generate-test',
    	method: 'POST',
    	headers: headers,
    	json: _ru
	}
	request(options, function(error, response, data) {


			if (!error && response.statusCode == 200) {

				user.step = 'test';
				user.count = count;
				user.test = objects.join(',')+':'+attributes.join(',');
				user.save();


				data.questions.forEach(function(question) {

					if (question.stem) {
				    	question.user = user.user_id;
				    	question.confirm = false;
				    	console.log(question);
				    	new Questions(question).save();
				    }

			  	});	

				setTimeout(function() {

					Questions
						.findOne({ user: user.user_id })
						.exec(function(error, question) {

							console.log(question);
							console.log(error);

							if (!question) {
								user.step = 'complete';
								user.save();
								return false;
							}

							user.step = question.guid;
							user.save();
							console.log('Вопрос: '+ question.guid);
							
							let answer = question.stem + "\n";

							if (question.answer_form == 'choice')  
								answer = answer + "Выберите один правильный вариант \n";

							if (question.answer_form == 'options')  
								answer = answer + "Выберите несколько правильных вариантов через запятую \n";

							if (question.answer_form == 'binary')  
								answer = answer + "Напишите номер правильного ответа \n";

							question.distractors.forEach(function(row, i) {
						    	answer = answer + (i+1) + ': ' + row + "\n";
						  	});	

							// stem
							bot.reply(user.user_id, answer);



						});



				}, 1000);
			  	
				


			} else {

				console.log(response.statusCode);
				console.log(_ru);

				bot.reply(user.user_id, 'Я не понял тебя - попробуй еще раз!');


			}


		})







	} catch(err) {
		return bot.reply(user.user_id, "Я не понял тебя - попробуй еще раз!");
	}

	

	


}

const testComplete = function(user) {

	var all = user.count;
	var all_true = 0; 

	user.step = 'complete';
	user.save();
	
   	Questions.count({ confirm: true, client_answer: true, user: user.user_id  }, function(err, c) {
   		all_true = c;

   		Questions.count({ confirm: true, user: user.user_id  }, function(err, b) {

   			all = b

   			let persent = Math.round(100/all*all_true);

       		let answer = "Поздравляем вы завершили тест. Процент правильных ответов составил: " + persent + "%";
       		bot.reply(user.user_id, answer);
       		stepComplete(user, '-----');

       		// Сохраняем результат
       		user.tests.push({
				objects: user.test,
				persent: persent
			});

			Questions.remove({ user: user.user_id }).exec();

			user.save();

		});

		});


}

const sendQuestion = function(user, question) {
	user.step = question.guid;
	user.save();
	let answer = question.stem + "\n";

	if (question.answer_form == 'choice')  
		answer = answer + "Выберите один правильный вариант \n";
	if (question.answer_form == 'options')  
		answer = answer + "Выберите несколько правильных вариантов через запятую \n";
	if (question.answer_form == 'binary')  
		answer = answer + "Напишите номер правильного ответа \n";

	question.distractors.forEach(function(row, i) {
    	answer = answer + (i+1) + ': ' + row + "\n";
  	});	
	// stem
	bot.reply(user.user_id, answer);
}

const stepTest = function(user, message) {

	var data = message.split(',') || [message];

	data.map(function(item) {
		return parseInt(item) - 1;
	});

	console.log('Вопрос: '+ user.step);

	Questions
		.findOne({ user: user.user_id, guid: user.step })
		.exec(function(error, question) {

			let find = { user: user.user_id, confirm: false, guid: { $ne: user.step } };

			if (user.step != 'test') {

				
				// Вопрос отвечен
				question.confirm = true;
				if (question.key.length == data.length
				    && question.key.every(function(u, i) {
				        return u === data[i];
				    })
				) {
				   question.client_answer = true;
				} else {
				   question.client_answer = false;
				   find.entity1 = question.entity1;
				}

				question.save();

				// Статистика
				user.answers = user.answers + 1;
				if (question.client_answer) user.true_answers = user.true_answers + 1;

				user.count = user.count - 1;
				user.save();


			}

	
			
			setTimeout(function() {

			Questions
				.findOne(find)
				.exec(function(error, question) {

					console.log(question, error); 

					if ((question == null) || (user.count < 1)) {

						Questions
						.findOne({ user: user.user_id, confirm: false, guid: { $ne: user.step } })
						.exec(function(error, question) {
							if ((question == null) || (user.count < 1)) testComplete(user);
							else sendQuestion(user, question);
						});
						
					} else sendQuestion(user, question);

					

				});

			}, 1000);



		});



}


const stepComplete = function(user, message) { 


	let answer = "Хотите начать тест сначала - введите 'Да'? \nДля показа статистики по прошлым тестам просто напишите 'Статистика'. \nДля удаления прошлых данных по статистике напишите 'Стереть'";

	if (message === 'да' || message === 'ДА' || message === 'Да') return stepCode(user, CODE);

	if (message === 'Статистика' || message === 'статистика' || message === 'СТАТИСТИКА') {

		let answer =  "Пройденные тесты: \n\n";
		user.tests.forEach(function(row, i) {
			var i = parseInt(i) + 1
	    	answer = answer + "Тест номер: " + i + "\nОбъекты и признаки: " + row.objects + '\nПроцент правильных ответов: ' + row.persent + "%\n\n";
	  	});	

		answer = answer + "Хотите начать тест сначала - введите 'Да'? \nДля удаления прошлых данных по статистике напишите 'Стереть'";
	  	bot.reply(user.user_id, answer);

	} else {
		let answer = "Хотите начать тест сначала - введите 'Да'? \nДля показа статистики по прошлым тестам напишите 'Статистика'. \nДля удаления прошлых данных по статистике напишите 'Стереть'";
		bot.reply(user.user_id, answer);
	}

	

}


bot.use(function(message) {

	//console.log(message);
	let query = { 
			user_id: message.peer_id 
		},
    	update = { 
    		user_id: message.peer_id 
    	},
    	options = { 
    		upsert: true, 
    		new: true, 
    		setDefaultsOnInsert: true
    	};

  	User.findOneAndUpdate(query, update, options, function(error, user) {

  		console.log(user);

  		if (user.step == '') user.step = 'start';

  		if ((message.body == 'стереть' || message.body == 'Стереть' || message.body == 'СТЕРЕТЬ') && user.step == 'complete') {

  			User.deleteMany({ user_id: message.peer_id }, function (err) {});
  			User.findOneAndUpdate(query, update, options, function(error, user) {
  				return stepStart(user, message.body);
  			});


  		} else {

	  		// Step 1
		    if      ((user.step == 'start')) 	return stepStart(user, message.body);
		    else if ((user.step == 'code')) 	return stepCode(user, message.body);
		    else if ((user.step == 'pretest')) 	return stepPretest(user, message.body);
		  	else if ((user.step == 'test')) 	return stepTest(user, message.body);
		  	else if ((user.step == 'complete')) return stepComplete(user, message.body);
		    else stepTest(user, message.body);

		}

	});
  	

});





bot.listen();