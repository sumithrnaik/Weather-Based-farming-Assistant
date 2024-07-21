document.getElementById('predictForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        N: formData.get('N'),
        P: formData.get('P'),
        K: formData.get('K'),
        temperature: formData.get('temperature'),
        humidity: formData.get('humidity'),
        ph: formData.get('ph'),
        rainfall: formData.get('rainfall')
    };

    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerText = 'Error: ' + data.error;
        } else {
            document.getElementById('Crop-rec').innerHTML='Most Suitable Crop for your condition:'+ data.result;
        }
    })
    .catch(error => {
        document.getElementById('result').innerText = 'Error: ' + error;
    });
});
