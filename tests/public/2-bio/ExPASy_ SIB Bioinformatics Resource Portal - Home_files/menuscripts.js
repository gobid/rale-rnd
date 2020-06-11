/**
 * @author: Robin Liechti, Manohar Jonnalagedda
 *
 * inspired from http://www.mathachew.com/sandbox/collapsible-menu/
 * $Id$
 */

function getOpenMenus(){
	return $$('#sib_left_menu li[class="menu_title"]').findAll(function(menuItem){
			return menuItem.next('li') != undefined && menuItem.next('li').visible() && menuItem.next('li').id.indexOf('_list') > -1;
	});
}

Event.observe(window, 'load', function() {
	$$('#sib_left_menu li[class="menu_title"]').each(function(menuItem){
		// Element.setStyle(menuItem,{cursor:'pointer'}); // could go to css
		Event.observe(menuItem,'click',function(event){
			if(event.findElement('ul').className == 'sib_submenu'){
				event.stop;
				return;
			}
			//check if the submenu has a ul, if so, expand it if not open
			var subMenuUl = menuItem.next('li');
			if(subMenuUl != undefined){
				if(subMenuUl.visible()){
					// if(subMenuUl.id.indexOf('_list')>-1) Effect.BlindUp(subMenuUl, {duration: 0.3});
				}else{
					getOpenMenus().each(function(menuItem){Effect.BlindUp(menuItem.next('li'), {duration: 0.3});})
					Effect.BlindDown(subMenuUl, {duration: 0.3});
				}
			}
		});
	});
	$$('#menu_categories_list li[class="sib_submenu"]').each(function(menuItem){
		Event.observe(menuItem,'click',function(event){
			if(menuItem.next('li').className == 'sib_subcategories'){Effect.BlindDown(menuItem.next('li'),{duration: 0.3})}
			$$('#menu_categories_list li[class="sib_submenu_selected"]').each(function(submenu){
				if(submenu.next('li').className == 'sib_subcategories') Effect.BlindUp(submenu.next('li'),{duration: 0.3})
			})
		})
	})
});