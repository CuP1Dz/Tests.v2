const { test, expect } = require('@playwright/test');
const { beforeEach } = require('node:test');
const { name } = require('../playwright.config');
const { request } = require('http');

const ApiURL = "https://students.aspro.cloud/api/v1/module/crm/lead/"

const ApiKey = "aXNDSVgxUTNBWmR1VGtuUlVhQlUzZ0J6ZXVZZFhXQktfMTE2Mjk1"

const account = { 
  username: 'kondrawka174@gmail.com', 
  password: 'kondrawka174' 
};

async function auth(page){
  await page.goto('https://students.aspro.cloud');
  await page.getByPlaceholder('E-mail').fill(account.username);
  await page.getByPlaceholder('Пароль').fill(account.password);
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.goto('https://students.aspro.cloud/_module/crm/view/leads?tab=list');
}

//-----------------------------------------------------------

test.describe('Тестирование UI', () => {

  test.beforeEach('Авторизация', async ({ page }) => {
    await auth(page);
  });

test('Кнопка "Создать" отображается', async ({ page }) => {
  const btnCreate = page.getByRole('button', { name: 'Создать' });

  await expect(btnCreate).toBeVisible();
});

  test('Поле "Поиск" отображается', async ({ page }) => {
    const searchPanel = page.locator('.search').first();
    
    await expect(searchPanel).toBeVisible();
  });
  
  test('Поле "Меню" отображается', async ({ page }) => {
    const menuPanel = page.locator('.js-current-filter-tooltip').first()

    await expect(menuPanel).toBeVisible();
  });

  test('Наполнение вкладки "Список" отображается', async ({ page }) => {
  
    const list = await page.locator('.fixed-table-container').first()

    await expect(list).toBeVisible();
  });
});


// -----------------------------------------------------------------------------

test.describe('API', () => {
  const params = {
    name: 'Delete'
  }
  
  async function sendPostFetch(parameters) {
    
    const fullUrl = `${ApiURL}create?api_key=${ApiKey}`;
    const responce = await fetch(fullUrl, {
        method: 'POST',
        body: parameters
    });

    return responce;
}

async function sendUpdateFetch(parameters) {
    
  const fullUrl = `${ApiURL}update/11?api_key=${ApiKey}`;
  const responce = await fetch(fullUrl, {
      method: 'POST',
      body: parameters
  });

  return responce;
}

  test('добавляем объект через POST запрос', async() => {

    const request = new URLSearchParams();
    request.append('name', params.name);

    const responce = await sendPostFetch(request);
    expect(responce.status).toBe(200);

    expect(request.get('name')).toBe(params.name);
  })

  test('Получаем список при помощи GET запроса', async({request}) =>{
    const params_id = {
      id: 1
    }

    const fullUrl = `${ApiURL}1?api_key=${ApiKey}`;

    const response = await request.get(fullUrl)
    expect(response.status()).toBe(200);
    console.log(await response.json());

    const jsonData = JSON.parse(await response.text());
    expect(jsonData).not.toBeNull();
    expect(jsonData.response.id).toBe(params_id.id);
  })

  test('Обновление инормации объекта через POST запрос', async() => {

    const request = new URLSearchParams();
    request.append('name', params.name);

    const responce = await sendUpdateFetch(request);
    expect(responce.status).toBe(200);

    expect(request.get('name')).toBe(params.name);
  })

  test.afterEach('Задержка перед запросами', async({page}) =>{
    await page.waitForTimeout(3000)
  })
})

//----------------------------------------------------------------
