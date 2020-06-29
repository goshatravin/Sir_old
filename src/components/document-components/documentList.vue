<template>
    <div class="document">
        <div class="document__titles list__data">
            <!-- <div class="document__items">Состояние</div> -->
            <div class="document__items">
                <input type="text" v-model="search['priority']" class="document_search list__data--inputs" placeholder="Приоритет">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['refid_number']" class="document_search list__data--inputs" placeholder="№ Дела">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['serial_number']" class="document_search list__data--inputs" placeholder="№">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['policy_number']" class="document_search list__data--inputs" placeholder="Полис">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['claim_name_status']" class="document_search list__data--inputs" placeholder="Текущий статус">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['fullname_insured']" class="document_search list__data--inputs" placeholder="ЗЛ">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['name_cntry_position']" class="document_search list__data--inputs" placeholder="Страна">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['ins_name']" class="document_search list__data--inputs" placeholder="Страховщик">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['responsible']" class="document_search list__data--inputs" placeholder="Ответственный">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['med_center_name']" class="document_search list__data--inputs" placeholder="Мед.центр">
            </div>
            <div class="document__items">
                <input type="text" v-model="search['desc']" class="document_search list__data--inputs" placeholder="Примечание">
            </div>
        </div>
        <div class="document__list">
            <div class="document__json" :id="item.id_claim_case" @click="getComment(item.id_claim_case,item.id_claim)" v-for="(item,index) in filteredJson" :key="item.id_claim_case" :name="index" v-on:dblclick="openCase(item.id_claim_case)">
                <div class="document__data" :title="item.priority">
                    {{ item.priority }}
                </div>
                <div class="document__data" :title="item.refid_number">
                    {{ item.refid_number }}
                </div>
                <div class="document__data" :title="item.serial_number">
                    {{ item.serial_number }}
                </div>
                <div class="document__data" :title="item.policy_number">
                    {{ item.policy_number }}
                </div>
                <div class="document__data" :title="item.claim_name_status">
                    {{ item.claim_name_status }}
                </div>
                <div class="document__data" :title="item.fullname_insured">
                    {{ item.fullname_insured }}
                </div>
                <div class="document__data" :title="item.name_cntry_position">
                    {{ item.name_cntry_position }}
                </div>
                <div class="document__data" :title="item.ins_name">
                    {{ item.ins_name }}
                </div>
                <div class="document__data" :title="item.responsible">
                    {{ item.responsible }}
                </div>
                <div class="document__data" :title="item.med_center_name">
                    {{ item.med_center_name }}
                </div>
                <div class="document__data" :title="item.desc">
                    {{ item.desc }}
                </div> 
            </div>
        </div>
        <div class="document__titles comments__data">
            <div class="document__items ">
                <input type="text" v-model="searchComment['dttmcr']" class="document_search comments__data--inputs" placeholder="Дата">
            </div>
            <div class="document__items ">
                <input type="text" v-model="searchComment['type_name']" class="document_search comments__data--inputs" placeholder="Тип комментария">
            </div>
            <div class="document__items ">
                <input type="text" v-model="searchComment['has_doc']" class="document_search comments__data--inputs" placeholder="Документ">
            </div>
            <div class="document__items ">
                <input type="text" v-model="searchComment['rates']" class="document_search comments__data--inputs" placeholder="Сумма">
            </div>
            <div class="document__items ">
                <input type="text" v-model="searchComment['crncy_code']" class="document_search comments__data--inputs" placeholder="Валюта">
            </div>
            <div class="document__items ">
                <input type="text" v-model="searchComment['status']" class="document_search comments__data--inputs" placeholder="Статус">
            </div>
            <div class="document__items ">
                <input type="text" v-model="searchComment['confid']" class="document_search comments__data--inputs" placeholder="Конфиденциально">
            </div>
            <div class="document__items ">
                <input type="text" v-model="searchComment['desc']" class="document_search comments__data--inputs" placeholder="Описание">
            </div>
        </div>
        <div class="document__comment">
            <div class="document__comments" :id="comment.id_comment" @click="getFiles(comment.id_comment)" v-for="comment in filteredComments" :key="comment.id_comment">
                <div class="document__item" :title="comment.dttmcr">
                    {{ comment.dttmcr }}
                </div> 
                <div class="document__item" :title="comment.type_name">
                    {{ comment.type_name }}
                </div>
                <div class="document__item" :title="comment.has_doc">
                    {{ comment.has_doc }}
                </div>
                <div class="document__item" :title="comment.rates">
                    {{ comment.rates }}
                </div>
                <div class="document__item" :title="comment.crncy_code">
                    {{ comment.crncy_code }}
                </div>
                <div class="document__item" :title="comment.status">
                    {{ comment.status }}
                </div>
                <div class="document__item" :title="comment.confid">
                    {{ comment.confid }}
                </div>
                <div class="document__item" :title="comment.desc">
                    {{ comment.desc }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl,
            EVENT_LIST: this.$root._data.EVENT_LIST,
            claim:[],
            search: [],
            searchComment:[],
            comments:[],
            active:[],
            case: [],
        };
    },
    beforeMount(){
        axios({
            method: 'POST',
            url: `${this.apiUrl}/api/case/case`,
            withCredentials: true,
        })
            .then((resp) => {
                this.claim = resp.data
                console.log(resp)
            });
    },
    computed:{
        filteredJson: function(){
            return this.claim.filter((x) => {
                let match = true;
                for(let i in this.search){
                    if(x[i] == null){
                        x[i] = ''
                    }
                    if(!x[i].toString().toLowerCase().match(this.search[i].toLowerCase())){
                        match = false;
                    } 
                }
                return match;
            });
        },
        filteredComments: function(){
            if(this.comments){
                return this.comments.filter((x) => {
                    let match = true;
                    for(let i in this.searchComment){
                        if(x[i] == null){
                            x[i] = ''
                        }
                        if(!x[i].toString().toLowerCase().match(this.searchComment[i].toLowerCase())){
                            match = false;
                        } 
                    }
                    return match;
                });
            }
        }
    },
    methods:{
        getComment: function(e,a){
            // console.log(this.claim[document.getElementById(e).getAttribute("name")])
            if(typeof(this.active['doc']) != 'undefined'){
                this.active['comment'] = '';
                document.getElementById(this.active['doc']).classList.remove('active--doc');
            }
            this.active['doc'] = e;
            const item = document.getElementById(this.active['doc']).classList.add('active--doc');
            //
            axios({
                url: `${this.apiUrl}/api/case/casecomment`,
                withCredentials: true,
                data: {
                    data: [{
                        id_claim_case: e,
                        id_claim: a 
                    }],
                },
                method: 'POST',
            })
                .then((resp) => {
                    console.log(resp);
                    this.comments = resp.data
                    this.$root.$emit(this.EVENT_LIST.SET_FILES, []);
                });
        },

        openCase: async function(e){

            this.case = await this.claim[document.getElementById(e).getAttribute("name")]

            await this.$store.dispatch('open_case', {
                case: this.case
            })

            await this.$router.push('/recase')
        },
        getFiles: function(e){
            let apiUrl = this.$store.getters.apiUrl
            if(typeof(this.active['comment']) != 'undefined' && (this.active['comment']) != ''){
                document.getElementById(this.active['comment']).classList.remove("active--docq");
            }
            this.active['comment'] = e;
            const item = document.getElementById(this.active['comment']).classList.add("active--docq");
            axios({
                url: `${this.apiUrl}/api/case/casecommentfile`,
                withCredentials: true,
                data: {
                    data: [{
                        id_comment: e
                    }],
                },
                method: 'POST',
            })
                .then((resp) => {
                    console.log(resp);
                    this.$root.$emit(this.EVENT_LIST.SET_FILES, resp.data);
                });
        }

    }
}
</script>

<style scoped>
.active--doc{
    background: var(--lightgreen);;
}
.active--docq{
    background: var(--lightgreen);
}
.list__data--inputs{
    background: var(--lightblue);
}
.list__data--inputs::placeholder{
    color: var(--black);
}
.document_search{
    border:none;
    outline: none;
    
}
.document__list{
    height: 45vh;
    overflow-y:scroll;
    position: relative;
}
.document__json{
    display: grid;
    grid-template-columns:  minmax(5rem, 7rem) minmax(5rem, 7rem) minmax(2rem, 3rem) minmax(5rem, 7rem) minmax(6rem, 8rem) minmax(5rem, 9rem) minmax(5rem, 7rem) minmax(7rem, 1fr) minmax(7rem, 8rem) minmax(7rem, 1fr) minmax(7rem, 8rem);
    transition: 0.2s all;
    padding-left: 3.7rem;
}
.document{
    background: white;
    width: 80%;
    box-shadow: var( --boxShadow);
    height: 100%;
}
.document__titles{
    display: grid;
    /* border-bottom: 1px solid var(--grey); */
    padding: 1rem 0;
    color: var(--normalgrey);
    padding-left: 3.7rem;
}
.list__data{
    grid-template-columns: minmax(5rem, 7rem) minmax(5rem, 7rem) minmax(2rem, 3rem) minmax(5rem, 7rem) minmax(6rem, 8rem) minmax(5rem, 9rem) minmax(5rem, 7rem)  minmax(7rem, 1fr) minmax(7rem, 8rem) minmax(7rem, 1fr) minmax(7rem, 8rem);
    background: var(--lightblue);
}
.comments__data{
    grid-template-columns: minmax(5rem, 10rem) minmax(5rem, 20rem) minmax(5rem, 10rem) minmax(1rem, 5rem) minmax(1rem, 5rem) minmax(1rem, 5rem) minmax(1rem, 10rem)  minmax(1rem, 1fr);
    margin-top: 3rem;
    /* border-top: 1px solid var(--grey); */
    background: var(--lightblue);
}
.document__data{
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--grey);
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;
}
.document__json:hover{
    background: var(--lightgrey);
    transition: 0.2s all;
    cursor: pointer;
}
.document__items{
    padding-top: 0.5rem;
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;
}
.document__comments{
    display: grid;
    grid-template-columns:minmax(5rem, 10rem) minmax(5rem, 20rem) minmax(5rem, 10rem) minmax(1rem, 5rem) minmax(1rem, 5rem) minmax(1rem, 5rem) minmax(1rem, 10rem)  minmax(1rem, 1fr);
    padding-left: 3.7rem;
}
.document__comment{
    height: 34vh;
    overflow-y:scroll;
}
.document__item{
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;
        padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--grey);
    font-size: 0.8rem;
}
.document__comments:hover{
    background: var(--lightgrey);
    transition: 0.2s all;
    cursor: pointer;
}
.comments__data--inputs{
    background: var(--lightblue);
}
.comments__data--inputs::placeholder{
    color: var(--black);
}
</style>
