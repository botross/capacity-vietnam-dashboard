import { LoginDto } from "@/Api/models";

export async function apiLoginUser(credentials: LoginDto) {
    try {

        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error("Not registered or Invalid Credentials");
        }
        return response
    } catch (error) {
        throw error
    }
}

export async function apiUploadRar(body: any) {
    try {

        const response = await fetch(`/api/uploadZip`, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: body,
        });

        return response
    } catch (error) {
        throw error
    }
}



// export async function apiVerifyUser(credentials: VerifyEmailDTO) {
//     try {
//         const response = await fetch(`/api/auth/verify`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(credentials),
//         });
//         if (!response.ok) {
//             throw new Error("Failed to verify user");
//         }
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }



export async function apiLogoutUser() {
    try {
        const response = await fetch(`/api/auth/logout`, {
            method: "GET",
        })
        window.location.reload()
        return response
    } catch (error: any) {
        throw new Error(error)
    }
}