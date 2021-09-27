<template>
    <div >
        <div v-for="item in list">
            <div style="margin:5px 25px">
             <!-- <span v-if="item.name">device_name:{{item.name}}</span>              -->
             <span v-if="item.protocol" >{{item.protocol}} Device</span>
             <span v-if="item.label" >{{item.label}}</span>

             <span v-if="item.type_name" >{{item.type_name}}</span>
             <span v-if="item.name" >Name: {{item.name}}</span>

             <span v-if="item.station_id">station_id:{{item.station_id}}</span>
             <span v-if="item.ip">ip:{{item.ip}}</span>             
             <span v-if="item.port">port:{{item.port}}</span>             
             <span v-if="item.client_id">client_id:{{item.client_id}}</span>             
             <span v-if="item.username">username:{{item.username}}</span>                  
             <span v-if="item.password">password:{{item.password}}</span>             
            </div>
            <div v-if="item.children" style="margin:5px 25px">
                <Recursion :list="item.children"></Recursion>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "Recursion",
    props: {
        list: Array
    }
}
</script>