<template>
  <div>
      <Recursion :list="list"></Recursion>
    <p>this is view</p>
  </div>
</template>
<script>
import Recursion from "../../components/recursion/recursion.vue";
export default {
    components:{Recursion},
  data() {
    return {
      list: [
        {
          protocol: "MODBUS Device",
          children: [
            {
              type_name: "MCU MH",
              children: [
                {
                  name: "name1",
                  station_id: 1,
                },
                {
                  name: "name2",
                  station_id: 2,
                },
              ],
            },
            {
              type_name: "SKL",
              children: [
                {
                  type_name: "长江路-7天",
                  children: [
                    {
                      name: "IEC61850",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          protocol: "NX Power Device",
          children: [
            {
              type_name: "如家",
              children: [
                {
                  name: "上江路-如家",
                }
              ],
            }
          ],
        },
        {
          protocol: "MODBUS Device",
          children: [
            {
              name: "如家",
              children: [
                {
                  name: "上江路-如家",
                  number: "1232",
                },
                {
                  name: "望江路-如家",
                },
              ],
            },
            {
              name: "7天",
              children: [
                {
                  name: "长江路-7天",
                },
                {
                  name: "望江路-7天",
                },
              ],
            },
          ],
        },
      ],
    };
  },
};
</script>