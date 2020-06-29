<template>
    <div class="tools">
        <div class="tools__row">
            <div class="row__item">
                    <a href="http://tablo.accidentlaw.ru/" target="_blank">
                    <svg class="row_svg" width="77px" height="77px" viewBox="0 0 77 77" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Desktop-HD" transform="translate(-110.000000, -140.000000)">
                            <g id="Group" transform="translate(110.000000, 140.000000)">
                                <rect id="Rectangle" fill="#0892D0" x="0" y="0" width="77" height="77" rx="6"></rect>
                                <polygon id="Rectangle" fill="#FFFFFF" points="39.5 30 48 38.5 39.5 47 31 38.5"></polygon>
                                <polygon id="Rectangle" stroke="#FFFFFF" fill="#0892D0" points="62 49 66 53 62 57 58 53"></polygon>
                                <path d="M57.4791847,38.5 L23.5,38.5" id="Line-Copy-2" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <polygon id="Rectangle-Copy" fill="#0892D0" points="39.5 32 46 38.5 39.5 45 33 38.5"></polygon>
                                <path d="M37.4791847,61.5 L25.7859914,61.5" id="Line-Copy" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <circle id="Oval" fill="#FFFFFF" cx="17.5" cy="38.5" r="6.5"></circle>
                                <circle id="Oval-Copy-2" fill="#FFFFFF" cx="39.5" cy="60.5" r="5.5"></circle>
                                <circle id="Oval-Copy-4" fill="#FFFFFF" cx="62" cy="38" r="6"></circle>
                                <path d="M17.5,34.5 L17.5,21.5" id="Line-2" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <path d="M39.5,57.5 L39.5,46.5" id="Line-2-Copy" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <path d="M62,33 L62,22" id="Line-2-Copy-3" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <path d="M62,49 L62,38" id="Line-2-Copy-2" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <rect id="Rectangle" stroke="#FFFFFF" fill="#0892D0" x="12.5" y="11.5" width="10" height="10"></rect>
                                <path d="M23.5,14.5 L33.6173835,14.5" id="Line-3" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <path d="M23.5,20.5 L41.4413083,20.5" id="Line-3-Copy" stroke="#FFFFFF" stroke-linecap="square"></path>
                                <circle id="Oval" fill="#FFFFFF" cx="42.5" cy="20.5" r="2.5"></circle>
                                <circle id="Oval-Copy" fill="#FFFFFF" cx="33.5" cy="14.5" r="1.5"></circle>
                                <circle id="Oval-Copy-3" stroke="#FFFFFF" fill="#0892D0" cx="24.5" cy="61.5" r="2.5"></circle>
                                <rect id="Rectangle" stroke="#FFFFFF" fill="#0892D0" x="57.5" y="14.5" width="9" height="9"></rect>
                            </g>
                        </g>
                    </g>
                </svg>
                </a>
                <p class="row_text">Табло КЦ</p>
            </div>
            <!--  -->
            <div class="row__item">
                <a href="/ingos" target="_blank">
                    <svg class="row_svg" width="77px" height="77px" viewBox="0 0 77 77" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Desktop-HD" transform="translate(-214.000000, -140.000000)">
                                <rect id="Rectangle" fill="#0892D0" x="214" y="140" width="77" height="77" rx="6"></rect>
                                <text id="ИНГОС" font-family="sans-serif, SF Pro Text" font-size="15" font-weight="bold" letter-spacing="0.0833333437" fill="#FFFFFF">
                                    <tspan x="225" y="184">ИНГОС</tspan>
                                </text>
                            </g>
                        </g>
                    </svg>
                </a>
                <p class="row_text">Форма ингосстрах</p>
            </div>
            <!--  -->
            <!-- <div class="row__item">
                <a href="/chat">
                    <svg class="row_svg" width="77px" height="77px" viewBox="0 0 77 77" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Desktop-HD" transform="translate(-214.000000, -140.000000)">
                                <rect id="Rectangle" fill="#0892D0" x="214" y="140" width="77" height="77" rx="6"></rect>
                                <text id="ИНГОС" font-family="sans-serif, SF Pro Text" font-size="15" font-weight="bold" letter-spacing="0.0833333437" fill="#FFFFFF">
                                    <tspan x="225" y="184">ЧАТ</tspan>
                                </text>
                            </g>
                        </g>
                    </svg>
                </a>
                <p class="row_text">Чат</p>
            </div> -->
        </div>
        <div class="tools__row">
            <div class="row__item">
            </div>
        </div>
        <div class="tools__row">
            <div class="row__item">
            
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
.tools{
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.tools__row{
    width: 80rem;
    height: 10rem;
    background: var(--white);
    box-shadow: var(--boxShadow);
    display: flex;
    align-items: center;
    padding-left: 3.5rem;
    justify-content: flex-start;
}
.row_text{
    font-size: 0.9rem;
    text-align: center;
    padding-top: 0.5rem;
}
.row_svg{
    cursor: pointer;
}
.row__item{
    margin-right: 3rem;
    text-align: center;
}
</style>

