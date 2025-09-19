// Função para criptografar o arquivo
function criptografarArquivo() {
    const fileInput = document.getElementById('fileInput');
    const password = document.getElementById('password').value;

    if (fileInput.files.length === 0 || password === '') {
        alert('Por favor, selecione um arquivo e insira a chave secreta!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const fileContent = event.target.result; // Conteúdo do arquivo como ArrayBuffer

        // Convertendo o ArrayBuffer para Base64 (reconhecido pelo crypto-js)
        const base64FileContent = arrayBufferToBase64(fileContent);

        // Criptografando o conteúdo do arquivo com AES e a chave secreta
        const encrypted = CryptoJS.AES.encrypt(base64FileContent, password).toString();

        // Convertendo o conteúdo criptografado para Blob
        const blob = new Blob([encrypted], { type: 'text/plain' });

        // Criando o link para download
        const downloadLink = document.getElementById('downloadLink');
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = 'block';
        downloadLink.download = file.name + '.enc'; // Nome do arquivo criptografado
    };

    reader.readAsArrayBuffer(file); // Lê o arquivo como ArrayBuffer
}

// Função para descriptografar o arquivo
function descriptografarArquivo() {
    const fileInput = document.getElementById('fileInputDecrypt');
    const password = document.getElementById('passwordDecrypt').value;

    if (fileInput.files.length === 0 || password === '') {
        alert('Por favor, selecione um arquivo criptografado e insira a chave secreta!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const encryptedContent = event.target.result;

        try {
            // Descriptografando o conteúdo do arquivo com AES e a chave secreta
            const bytes = CryptoJS.AES.decrypt(encryptedContent.toString(), password);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

            // Convertendo o Base64 de volta para ArrayBuffer
            const decryptedArrayBuffer = base64ToArrayBuffer(decryptedData);

            // Exibe o conteúdo descriptografado no campo <pre>
            const decryptedContent = document.getElementById('decryptedContent');
            const text = arrayBufferToText(decryptedArrayBuffer);
            decryptedContent.textContent = text;
            // Criar Blob com os dados descriptografados
            const blob = new Blob([decryptedArrayBuffer]);

            // Criar link de download para o arquivo restaurado
            const downloadLink = document.getElementById('downloadDecrypted');
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;

            // Recuperar nome original sem a extensão ".enc"
            let originalName = file.name;
            if (originalName.endsWith('.enc')) {
                originalName = originalName.slice(0, -4); // remove ".enc"
            }

            downloadLink.download = originalName; // Nome original restaurado
            downloadLink.style.display = 'block';


        } catch (e) {
            alert('Erro ao descriptografar: Verifique a chave secreta!');
        }
    };

    reader.readAsText(file); // Lê o arquivo criptografado como texto
}

// Função para converter ArrayBuffer para Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary); // Retorna a string Base64
}

// Função para converter Base64 para ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer; // Retorna ArrayBuffer
}

// Função para converter ArrayBuffer para texto
function arrayBufferToText(buffer) {
    const decoder = new TextDecoder();
    return decoder.decode(buffer); // Retorna o texto original
}