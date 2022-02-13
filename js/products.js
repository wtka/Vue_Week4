import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.28/vue.esm-browser.min.js';
import pagination from '../components/pagination.js';
import modalForProduct from '../components/modalForProduct.js';
import modalForDelProduct from '../components/modalForDelProduct.js';;

const site = "https://vue3-course-api.hexschool.io/v2";
const path = "wtka";

let productModal = {};
let delProductModal = {};

const app = createApp({
    components: {
        pagination,
        modalForProduct,
        modalForDelProduct
    },
    data() {
        return {
            path: path,
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
            pagination: {},
        }
    }, 
    methods: {
        // 檢查登入
        checkLogin() {      
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');      
            // 在全域預設 headers 設定預設值
            axios.defaults.headers.common.Authorization = token;
            const url = `${site}/api/user/check`;
            axios.post(url)
            .then(() => {                    
                this.getProducts();
            })
            .catch((err) => {                    
                alert(err.data.message);
                window.location = 'index.html';
            });
        },
        // 取得產品列表
        getProducts(page = 1) { // 參數預設值
            // API 常見參數
            // query 使用 ? 帶參數
            // param
            const url = `${site}/api/${path}/admin/products?page=${page}`;
            axios.get(url)
            .then((res) => {
                console.log(res.data.products);
                this.products = res.data.products;  
                this.pagination = res.data.pagination;                                
            })
            .catch((err) => {
                alert(err.data.message);
            });
        },
        // 開啟 modal
        openModal(status, product) {
            if(status === 'new') {
                // 清空資料
                this.tempProduct = {
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            }
            else if(status === 'edit') {
                // 使用淺拷貝，如果有要顯示內層的圖，需要使用深拷貝
                this.tempProduct = { ...product };
                productModal.show();
                this.isNew = false;
            }
            else if(status === 'delete') {
                this.tempProduct = { ...product };
                delProductModal.show();            
            }            
        },
        // 更新產品
        updateProduct() {
            let url = `${site}/api/${path}/admin/product`;
            let method = 'post';
            if(!this.isNew) {
                url = `${site}/api/${path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            // 依照後端需求，傳入 data 物件
            axios[method](url, { data: this.tempProduct })
            .then((res) => {                
                this.getProducts();
                productModal.hide();
            })
            .catch((err) => {
                alert(err.data.message);
            }); 
        },                
        // 刪除產品
        deleteProduct() {            
            let url = `${site}/api/${path}/admin/product/${this.tempProduct.id}`;            
            axios.delete(url)
            .then((res) => {                    
                this.getProducts();
                delProductModal.hide();
            })
            .catch((err) => {
                alert(err.data.message);
            }); 
        }
    },
    mounted() {
        // 檢查登入
        this.checkLogin();
        // 初始化 modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));        
    }
});

app.mount('#app');

