import { test } from '@pages/base-page';
import { Assertions } from '@utilities/assertions';
import * as allure from 'allure-js-commons';

test.describe('Posts API', () => {
    test('Verify GET post by ID', {
        tag: ['@api', '@smoke', '@P1'],
        annotation: [
            { type: 'feature', description: 'API Testing' },
            { type: 'story', description: 'Get Post' },
        ],
    }, async({ apiPage }) => {
        await allure.severity('critical');
        apiPage.baseUrl = 'https://jsonplaceholder.typicode.com';

        const response = await apiPage.apiGetRequest(
            '/posts/1'
        );

        Assertions.assertEqual(response.status(), 200);

        const body = await response.json();

        Assertions.assertEqual(body.id, 1);
        Assertions.assertEqual(body.userId, 1);

        const contentType = response.headers()['content-type'];

        Assertions.assertEqual(
            contentType?.includes('application/json') ?? false,
            true
        );
    });
});
