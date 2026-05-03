const { determineAgeGroup } = require('./utils');
describe('Тестирование функционала работы с возрастными группами и фильтрацией', () => {
    test('Проверка определения возрастной группы при дате рождения в будущем', () => {
        const futureDate = new Date().getFullYear() + 1;
        const birthDate = `20${futureDate}-01-01`;
        expect(determineAgeGroup(birthDate)).toBe('Вне диапозона');
    });
});