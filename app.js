class VimeoUploader {
    constructor() {
        this._url = 'https://api.vimeo.com'
        this._clientId = '5790e7b0c4f779e05cec0fbd0aec4605dcfb99bb';
        this._clientSecrets = 'se6TvG+N2iysp6PhEeGFz6s9kkLeK+lSc5DTmkgEgvaSB8yQjRbCV0ZmyaSPx5kjE8q9Xds4Q59bS1WB/ab48UQkU/5NzRnTXSMYVNe14KuMCCRx0YmDBRjuA7m5DdVy';
        this._accessToken = '15e97107eb6e2d28725f3c1039446dfa';
        
        this._inputFile = document.querySelector("#farquivo");
    }
    
    /**
     * Check if an request is possible
     * @returns {Promise} 
     */
    checkQuote() {
        let file = this._inputFile.files[0];
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'bearer ' + this._accessToken);
        myHeaders.append('Accept', 'application/vnd.vimeo.*+json;version=3.4');
        
        return new Promise((resolve, reject) => {
         fetch(this._url + '/me', { method: 'GET',
               headers: myHeaders,
             })
            .then(res => res.json())
            .then(res => (file.size < res.upload_quota.periodic.free && file.size < res.upload_quota.space.free) ? resolve(res) : reject('Arquivo muito grande'));
        });
    }
    
    createVideo() {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'bearer ' + this._accessToken);
        
        return new Promise((resolve, reject) => {
            this.checkQuote().then(() => {
                fetch(this._url + '/me/videos', { method: 'POST',
                headers: myHeaders,
                body: {
                        "upload" : {
                            "approach" : "post",
                            "redirect_url" : "{url}"
                        }
                    }
                 })
                .then(res => res.json())
                .then(res => resolve(res))
                .catch(res => reject(res))
            });
         
        }).catch(error => reject(error));
    }
    
    uploadVideo() {
        let file = this._inputFile.files[0];
        let myHeaders = new Headers();
        
        let fd = new FormData();
            fd.append("file_data", file);
        
        return new Promise((resolve, reject) => {
            this.createVideo().then((video) => {
                fetch(video.upload.upload_link, { 
                    method: 'POST',
                    headers: myHeaders,
                    body: fd
                })
                .then(res => res.json())
                .then(res => resolve(res))
                .catch(res => reject(res))
            }).catch(error => reject(error));
         
        });
    }
}