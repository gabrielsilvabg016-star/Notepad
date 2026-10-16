const IMGBB_API_KEY = '14ec2963cb8fc44320d0674c7be38801';

export const enviarImagemImgBB = async (
    imagemBase64: string
): Promise<string> => {

    const formData = new FormData();

    formData.append(
        'image',
        imagemBase64
    );
    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
            method: 'POST',
            body: formData
        }
    );
    const resultado = await response.json();
    if (!response.ok || !resultado.success) {
        console.log(
            'Erro ImgBB',
            resultado
        );
        throw new Error(
            'Erro ao enviar imagem para o ImgVBB'
        )
    };

    return resultado.data.display_url;
}