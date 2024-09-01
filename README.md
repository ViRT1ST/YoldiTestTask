Тестовое задание от Yoldi
==========================

Оригинальные ссылки:
[Задание](https://yoldi-agency.notion.site/Yoldi-7552752e30964431ab0ca03d54908148) |
[Figma](https://www.figma.com/design/Cws3gKEwGqPvJRhNLLY36u/Тестовое-задание-Yoldi)\
Копии ссылок (на случай удаления оригиналов):
[Задание](https://virt1st.notion.site/Yoldi-256cc6c99c6d4e368b22c44f83d9130e) |
[Figma](https://www.figma.com/design/pmDyALpAK1o8e78duRnRKO/Yoldi-(Copy))


## Моя реализация
- Фронт и бэк на Next.js (App Router, Server Actions)
- Аутентификация через Next-Auth (Auth.js) 
- Три варианта авторизации (Email-password, Google и GitHub)
- Валидация с помощью Zod
- Данные сохраняются в PostgreSQL (локально или в Vercel)
- Изображения сохраняются в Cloudinary (облако)
- Полная адаптивность как требовалось в задании
- Дизайн соответствует Figma (pixel-perfect на 99%)
- Вся стилизация на TailwindCSS, без UI-библиотек

## Демо

[Сслыка на рабочий проект на Vercel](https://virt1st-yoldi.vercel.app/page/demo)\
Примечание: при переходе по ссылке таблица с пользователями сбрасывается на дефолтный набор данных.

## Доступные действия

- Можно авторизироваться или регистрироваться на сайте.\
Пароль для всех дефолтных email-based аккаунтов: **password123!**\
Логины (почты) есть на странице со списком аккаунтов
- Авторизированнный пользователь может менять данные своего профиля (аватар, обложка, текст о себе, URL-alias)

- Можно сбросить список пользователей на дефолтные (на странице дебага или при переходе по /page/demo)

## Доступные пути
- [/page/accounts](https://virt1st-yoldi.vercel.app/page/accounts) (список пользователей)
- [/page/auth](https://virt1st-yoldi.vercel.app/page/auth) (форма авторизации)
- [/profile/me](https://virt1st-yoldi.vercel.app/page/profile/me) (профиль текущего пользователя)
- [/profile/\[id\]](https://virt1st-yoldi.vercel.app/page/profile/adminvlad) (профили других пользователей через URL-alias)
- [/page/debug](https://virt1st-yoldi.vercel.app/page/debug) (информация о next-auth-сессии, сброс таблицы пользователей в БД)

