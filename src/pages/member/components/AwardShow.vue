<template>
	<div class="award-show">
		{{awardList}}
		<header class="new" v-if="newList != null">
			<p>新会员奖励</p>
			<div v-if="newList[0].rewardType == 1 || newList.rewardType[0] == 3">
				{{newCouponList.couponName}}
			</div>
			<div v-else>
				{{newList.integral}}<span>积分</span>
			</div>
		</header>
		<!-- <footer class="old">
			<p>老会员奖励</p>
			<ul>
				<li v-for="(item,index) in oldList">
					<p>奖励{{index + 1}}:</p>
					<div v-if="item.rewardType == 1">
						{{item.couponList}}
					</div>
					<div v-if="item.rewardType == 2">
						
					</div>
					<div v-if="item.rewardType == 3">
						
					</div>
				</li>
			</ul>
		</footer> -->
	</div>
</template>

<script>
	export default{
		name:"awardShow",
		props:{
			awardList:{
				type:Array,
				default(){
					return []
				}
			}
		},
		data(){
			return{
				newList:null,
				newCouponList:{},
				oldList:null,
			}
		},
		watch:{
			awardList:{
				handler(){
					this.getNew()
					this.oldList = this.awardList.filter(item=>{
						return item.isNewVip == 1
					}).sort(function(a,b){
						return a.inviteCount - b.inviteCount
					})
					console.log(this.newList)
					console.log(this.oldList)
				},
				deep:true
			}
		},
		methods:{
			getNew(){
				this.newList = this.awardList.filter(item=>{
					return item.isNewVip == 0
				})
				if(this.newList[0].rewardType == 1 || this.newList[0].rewardType == 3){
					this.newCouponList = JSON.parse(this.newList[0].couponList)[0] 
					console.log(this.newCouponList)
				}
			},
		},
		filters:{
			filterOn(value){
				console.log(value)
			}
		}
	}
</script>

<style>
</style>
