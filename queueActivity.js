const accessToken = 'YOUR_GENESYS_ACCESS_TOKEN'; // Replace with actual access token

const payload = {
    filter: {
        type: "and",
        clauses: [
            {
                type: "or",
                predicates: [
                    { dimension: "queueId", value: "14daefcf-3fa8-41fd-9635-9eb0cbadde98" },
                    { dimension: "queueId", value: "f9bb7290-338f-4536-adcb-79cf808352b7" },
                    { dimension: "queueId", value: "a8064f1c-44f1-4439-9593-ac0055ade679" },
                    { dimension: "queueId", value: "56fcf5f9-2442-44e4-85ce-aca812b522d7" },
                    { dimension: "queueId", value: "f7630484-6911-4f2e-8360-6068e5e04c36" }
                ]
            }
        ]
    },
    metrics: [
        "oServiceLevel", "nOffered", "tAbandon", "tFlowOut", "tAnswered", "tHandle",
        "nTransferred", "tWait", "tTalkComplete", "tHeldComplete", "tAcw", "nOutbound",
        "nOverSla", "tShortAbandon", "nOutboundAttempted", "tVoicemail", "tContacting", "tDialing"
    ],
    groupBy: ["queueId"],
    interval: "2024-07-31T18:00:00.000Z/2024-07-31T18:30:00.000Z"
};

async function fetchQueueActivity() {
    try {
        const response = await fetch('https://api.mypurecloud.com/api/v2/analytics/conversations/aggregates/query', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        displayQueueActivity(data);
    } catch (error) {
        console.error(error);
    }
}

function displayQueueActivity(data) {
    const container = document.getElementById('queue-activity');
    container.innerHTML = '';

    data.results.forEach(result => {
        const queueDiv = document.createElement('div');
        queueDiv.classList.add('queue-container');

        const header = document.createElement('div');
        header.classList.add('queue-header');
        header.textContent = `Media Type: ${result.group.mediaType}, Queue ID: ${result.group.queueId}`;
        queueDiv.appendChild(header);

        result.data.forEach(dataPoint => {
            const interval = document.createElement('div');
            interval.textContent = `Interval: ${dataPoint.interval}`;
            queueDiv.appendChild(interval);

            const table = document.createElement('table');
            table.classList.add('metric-table');

            const headerRow = document.createElement('tr');
            const metricHeader = document.createElement('th');
            metricHeader.textContent = 'Metric';
            headerRow.appendChild(metricHeader);

            const maxHeader = document.createElement('th');
            maxHeader.textContent = 'Max';
            headerRow.appendChild(maxHeader);

            const minHeader = document.createElement('th');
            minHeader.textContent = 'Min';
            headerRow.appendChild(minHeader);

            const countHeader = document.createElement('th');
            countHeader.textContent = 'Count';
            headerRow.appendChild(countHeader);

            const sumHeader = document.createElement('th');
            sumHeader.textContent = 'Sum';
            headerRow.appendChild(sumHeader);

            table.appendChild(headerRow);

            dataPoint.metrics.forEach(metric => {
                const row = document.createElement('tr');

                const metricCell = document.createElement('td');
                metricCell.textContent = metric.metric;
                row.appendChild(metricCell);

                const maxCell = document.createElement('td');
                maxCell.textContent = metric.stats.max !== undefined ? metric.stats.max : '-';
                row.appendChild(maxCell);

                const minCell = document.createElement('td');
                minCell.textContent = metric.stats.min !== undefined ? metric.stats.min : '-';
                row.appendChild(minCell);

                const countCell = document.createElement('td');
                countCell.textContent = metric.stats.count !== undefined ? metric.stats.count : '-';
                row.appendChild(countCell);

                const sumCell = document.createElement('td');
                sumCell.textContent = metric.stats.sum !== undefined ? metric.stats.sum : '-';
                row.appendChild(sumCell);

                table.appendChild(row);
            });

            queueDiv.appendChild(table);
        });

        container.appendChild(queueDiv);
    });
}

fetchQueueActivity();
