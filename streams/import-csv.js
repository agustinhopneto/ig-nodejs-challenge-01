import fs from 'node:fs';
import { parse } from 'csv-parse';

async function importCSV() {
  const csvPath = new URL('./tasks.csv', import.meta.url);

  const fileStream = fs.createReadStream(csvPath);

  const parsedCSV = fileStream.pipe(
    parse({
      fromLine: 2,
      delimiter: ',',
      skipEmptyLines: true,
    })
  );

  for await (const line of parsedCSV) {
    const [title, description] = line;

    const response = await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
      }),
    });

    console.log(await response.text());
  }
}

(async () => {
  await importCSV();
})();
