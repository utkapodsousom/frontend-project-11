import 'bootstrap/scss/bootstrap.scss';
import './style.scss';
import * as yup from 'yup';
import onChange from 'on-change';

import render from './render';


console.log('Hello World!');

// После отправки данных формы, приложение должно производить валидацию и 
// подсвечивать красным рамку вокруг инпута, если адрес невалидный. 
// Помимо корректности ссылки, нужно валидировать дубли. Если урл уже есть
// в списке фидов, то он не проходит валидацию. После того как поток добавлен, 
// форма принимает первоначальный вид (очищается инпут, устанавливается фокус).

const elements = {
    form: document.getElementById('form'),
    input: document.getElementById('rss-url'),
    error: document.querySelector('.feedback'),
};

const initialState = {
    formState: 'idle',
    error: null,
    feeds: [],
};

const watchedState = onChange(initialState, render(initialState, elements));

// схема валидации урла, проверяем на наличие урла в стэйте
const makeSchema = (addedLinks) => yup.string().required().url().notOneOf(addedLinks);

const handleSubmit = (event) => {
    event.preventDefault();

    // получили ввод из инпута
    const formData = new FormData(event.target);
    const input = formData.get('url');
    const addedLinks = watchedState.feeds.map((feed) => feed);
    console.log(addedLinks);
    const schema = makeSchema(addedLinks);
    schema.validate(input)
        .then(() => {
            watchedState.error = null;
            watchedState.formState = 'submitting';
        })
        .then(() => {
            watchedState.formState = 'added';
            watchedState.feeds.push(input);
        })
        .catch((e) => {
            watchedState.formState = 'invalid';
            watchedState.error = e;
        });
}

elements.form.addEventListener('submit', handleSubmit);
