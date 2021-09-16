<template>
    <p>this is export</p>
</template>
<script>
export default {
    name:"export",
    data(){
        return {
            
        }
    },
    mounted(){
        var id = this.$route.params.id
        console.log(id)
    }
}
</script>