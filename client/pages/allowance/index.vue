<template>
    <div>
        <h1>Allownace</h1>
        <hr/>
        <p>Card Uuid: {{Global.testCardList[cardIndex]}}</p>
        <div class="card" v-if="JSON.stringify(cardInfo) == '{}'">
            <p>Memo: Loading...</p>
        </div>
        <div v-else>
            <p>Memo: {{cardInfo.memo}}</p>
        </div>
        <div class="embed-card" v-if="!(embedCard === '')">
            <iframe v-if="!(embedCard === '')" :srcdoc="embedCard" width="400" height="400" frameborder="0" allowtransparency="true" allowfullscreen="true"></iframe>
        </div>
        <div class="embed-card" v-else>
            <p>Embed Card: Loading...</p>
            <iframe width="400" height="400" frameborder="0" allowtransparency="true" allowfullscreen="true"></iframe>
        </div>
        <p>{{cardIndex + 1}} / {{maxCards}}</p>
        <button v-on:click="prevCard">Prev</button>
        <button v-on:click="nextCard">Next</button>
    </div>
</template>

<script setup>
import * as Global from "../../components/Global";
var cardIndex = ref(0);
var maxCards = Global.testCardList.length;
var cardInfo = ref({});
var embedRequest = ref({
    embed_request:"",
    hmac:""
})
var embedCard = ref("");

function nextCard() {
    cardIndex.value++;
    if (cardIndex.value >= maxCards) {
        cardIndex.value = 0;
    }
    updateCard();
}

function prevCard() {
    cardIndex.value--;
    if (cardIndex.value < 0) {
        cardIndex.value = maxCards - 1;
    }
    updateCard();
}

async function updateCardInfo() {
    cardInfo.value = {};
    await fetch(`https://darnoman-cors-proxy.herokuapp.com/https://api.lithic.com/v1/cards/${Global.testCardList[cardIndex.value]}`,
    {
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'api-key ' + Global.apiKey
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        cardInfo.value = data;
    })
}

async function updateEmbedRequest() {
    embedRequest.value = {
        embed_request:"",
        hmac:""
    };

    await fetch(`/api/cards/embed_request`,
        {
        method: 'PUT',
        body: JSON.stringify({
            cardUuid: Global.testCardList[cardIndex.value]
        })
    })
    .then(response => response.json())
    .then(data => {
        embedRequest.value = data;
    })
}

async function updateEmbedCard() {
    await fetch("https://darnoman-cors-proxy.herokuapp.com/https://api.lithic.com/v1/embed/card?embed_request=" + embedRequest.value.embed_request + "&hmac=" + embedRequest.value.hmac,
        {
            method: 'GET',
            headers: {
                'Authorization': 'api-key ' + Global.apiKey
            }
    })
    .then(response => response.text())
    .then(data => {
        embedCard.value = data;
    })
}

async function updateCard(){
    // clear previous card info
    cardInfo.value = {};
    embedRequest.value = {
        embed_request:"",
        hmac:""
    };
    embedCard.value = "";
    await updateCardInfo();
    await updateEmbedRequest();
    await updateEmbedCard();
}

updateCard();

</script>

<style>

</style>