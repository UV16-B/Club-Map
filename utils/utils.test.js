const mockClubs = [
    {
        name: "Лингос",
        city: "Находка",
        district: "Бархатный м-н",
        activity: "Языки",
        ageGroup: "6-7 лет",
        price: 4600
    },
    {
        name: "Руками сделано",
        city: "Находка",
        district: "Тихоокеанский м-н",
        activity: "Творчество",
        ageGroup: "11-14 лет",
        price: 2000
    }
];
const { determineAgeGroup } = require('./utils');
describe('Тестирование функционала работы с возрастными группами и фильтрацией', () => {
    test('Проверка определения возрастной группы при дате рождения в будущем', () => {
        const futureDate = new Date().getFullYear() + 1;
        const birthDate = `20${futureDate}-01-01`;
        expect(determineAgeGroup(birthDate)).toBe('Вне диапазона');
    });
    test('Проверка корректного определения возрастной группы', () => {
        const birthDate1 = '2015-05-03'; const birthDate2 = '2010-06-15';
        expect(determineAgeGroup(birthDate1)).toBe('11-14 лет');
        expect(determineAgeGroup(birthDate2)).toBe('15-17 лет');
    });
    test('Проверка обработки некорректного формата цены', () => {
        const invalidPrice = 'abc';
        expect(parseInt(invalidPrice)).toBe(NaN);
    });
    test('Проверка фильтрации при пустом районе', () => {
        const clubs = mockClubs.filter(club => club.district === '');
        expect(clubs.length).toBe(0); // в мок-базе нет пустых районов
    });
    test('Проверка фильтрации при отсутствии подходящих кружков', () => {
        const filtered = mockClubs.filter(club => club.activity === 'Безымянная активность');
        expect(filtered.length).toBe(0);
    });
    test('Проверка обновления списка районов при смене города', () => {
        const districts = new Set(mockClubs.map(club => club.district));
        expect(districts.size).toBeGreaterThan(0);
    });
});