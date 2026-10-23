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
    }, async({ request }) => {
        await allure.severity('critical');

        const response = await request.get(
            'https://jsonplaceholder.typicode.com/posts/1'
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
