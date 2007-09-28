/*
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2007 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Yahoo! Public License
 * Version 1.0 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * 
 * ***** END LICENSE BLOCK *****
 */

/**
* @constructor
* @class ZaCertsServerListController
* This is a singleton object that controls all the user interaction with the list of ZaServer objects
* @author Greg Solovyev
**/
ZaCertsServerListController = function(appCtxt, container, app) {
	ZaListViewController.call(this, appCtxt, container, app,"ZaCertsServerListController");
   	this._toolbarOperations = new Array();
   	this._popupOperations = new Array();			
	
	//TODO helpURL needs to be changed
	this._helpURL = location.pathname + "adminhelp/html/WebHelp/tools/creating_certificates.htm";	
}

ZaCertsServerListController.prototype = new ZaListViewController();
ZaCertsServerListController.prototype.constructor = ZaCertsServerListController;

ZaController.initToolbarMethods["ZaCertsServerListController"] = new Array();
ZaController.initPopupMenuMethods["ZaCertsServerListController"] = new Array();

/**
* @param list {ZaItemList} a list of ZaServer {@link ZaServer} objects
**/
ZaCertsServerListController.prototype.show = 
function(list, openInNewTab) {
    if (!this._UICreated) {
		this._createUI();
	} 	
	if (list != null)
		this._contentView.set(list.getVector());
		
	this._app.pushView(this.getContentViewId());
	if (list != null)
		this._list = list;
			
	this.changeActionsState();	
}

ZaCertsServerListController.initToolbarMethod =
function () {
    this._toolbarOperations.push(new ZaOperation(ZaOperation.VIEW, zimbra_cert_manager.TBB_view_cert, zimbra_cert_manager.TBB_view_cert_tt, "Edit", "Edit", new AjxListener(this, ZaCertViewController.prototype.refreshListener)));	
   	this._toolbarOperations.push(new ZaOperation(ZaOperation.NEW, zimbra_cert_manager.TBB_launch_cert_wizard, zimbra_cert_manager.TBB_launch_cert_wizard_tt, "Backup", "Backup", new AjxListener(this, ZaCertsServerListController.prototype._newCertListener)));				
	this._toolbarOperations.push(new ZaOperation(ZaOperation.NONE));
	this._toolbarOperations.push(new ZaOperation(ZaOperation.HELP, zimbra_cert_manager.TBB_Help, zimbra_cert_manager.TBB_Help_tt, "Help", "Help", new AjxListener(this, this._helpButtonListener)));				
}
ZaController.initToolbarMethods["ZaCertsServerListController"].push(ZaCertsServerListController.initToolbarMethod);

ZaCertsServerListController.initPopupMenuMethod =
function () {
   	this._toolbarOperations.push(new ZaOperation(ZaOperation.VIEW, zimbra_cert_manager.TBB_view_cert, zimbra_cert_manager.TBB_view_cert_tt, "Edit", "Edit", new AjxListener(this, ZaCertViewController.prototype.refreshListener)));	
   	this._popupOperations.push(new ZaOperation(ZaOperation.NEW, zimbra_cert_manager.TBB_launch_cert_wizard, zimbra_cert_manager.TBB_launch_cert_wizard_tt, "Backup", "Backup", new AjxListener(this, ZaCertsServerListController.prototype._newCertListener)));				
}
ZaController.initPopupMenuMethods["ZaCertsServerListController"].push(ZaCertsServerListController.initPopupMenuMethod);

ZaCertsServerListController.prototype._createUI = function () {
	try {
		var elements = new Object();
		this._contentView = new ZaServerListView(this._container);
		this._initToolbar();
		if(this._toolbarOperations && this._toolbarOperations.length) {
			this._toolbar = new ZaToolBar(this._container, this._toolbarOperations); 
			elements[ZaAppViewMgr.C_TOOLBAR_TOP] = this._toolbar;
		}
		this._initPopupMenu();
		if(this._popupOperations && this._popupOperations.length) {
			this._actionMenu =  new ZaPopupMenu(this._contentView, "ActionMenu", null, this._popupOperations);
		}
		elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;
		//this._app.createView(ZaZimbraAdmin._SERVERS_LIST_VIEW, elements);
		var tabParams = {
			openInNewTab: false,
			tabId: this.getContentViewId(),
			tab: this.getMainTab() 
		}
		this._app.createView(this.getContentViewId(), elements, tabParams) ;

		this._contentView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
		this._contentView.addActionListener(new AjxListener(this, this._listActionListener));			
		this._removeConfirmMessageDialog = new ZaMsgDialog(this._app.getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], this._app);					
			
		this._UICreated = true;
		this._app._controllers[this.getContentViewId ()] = this ;
	} catch (ex) {
		this._handleException(ex, "ZaCertsServerListController.prototype._createUI", null, false);
		return;
	}	
}

ZaCertsServerListController.prototype.set = 
function(serverList) {
	this.show(serverList);
}

// new button was pressed
ZaCertsServerListController.prototype._newButtonListener =
function(ev) {
	if (AjxEnv.hasFirebug) console.log("ZaCertsServerListController.prototype._newButtonListener: start the cert installation wizard ...");
	//TODO: Get the server object and call the ZaCertViewController.prototype._newCertListener
}

/**
* This listener is called when the item in the list is double clicked. It call ZaServerController.show method
* in order to display the Server View
**/
ZaCertsServerListController.prototype._listSelectionListener =
function(ev) {
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		if(ev.item) {
			this._selectedItem = ev.item;
			this._app.getCertViewController().show(ZaCert.getCerts(this._app));
		}
	} else {
		this.changeActionsState();	
	}
}

ZaCertsServerListController.prototype._listActionListener =
function (ev) {
	this.changeActionsState();
	this._actionMenu.popup(0, ev.docX, ev.docY);
}

ZaCertsServerListController.prototype.changeActionsState = 
function () {
	if(this._contentView) {
		var cnt = this._contentView.getSelectionCount();
		if(cnt == 1) {
			var opsArray = [ZaOperation.VIEW, ZaOperation.NEW];
			this._toolbar.enable(opsArray, true);
			this._actionMenu.enable(opsArray, true);
		} else {
			var opsArray = [ZaOperation.VIEW, ZaOperation.NEW];
			this._toolbar.enable(opsArray, false);
			this._actionMenu.enable(opsArray, false);
		}
	}
}