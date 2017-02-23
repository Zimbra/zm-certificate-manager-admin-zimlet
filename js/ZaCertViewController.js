/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
if(window.console && window.console.log) console.log("Loaded ZaCertViewController.js");

function ZaCertViewController(appCtxt, container) {
	ZaController.call(this, appCtxt, container, "ZaCertViewController");
   	this._UICreated = false;
   	this._toolbarOperations = new Array();
   	this._popupOperations = new Array();			
	//this.ServerPool = [];
	this._helpURL = location.pathname + "help/admin/html/tools/creating_certificates.htm?locid=" + AjxEnv.DEFAULT_LOCALE;	
	this._app = ZaApp.getInstance() ;				
}

ZaCertViewController.prototype = new ZaController();
ZaCertViewController.prototype.constructor = ZaCertViewController;

ZaController.initToolbarMethods["ZaCertViewController"] = new Array();
ZaController.initPopupMenuMethods["ZaCertViewController"] = new Array();

ZaCertViewController.prototype.show = 
function(certs, targetServerId) {
    var viewConstructor = ZaCertView ;
    if ( !this.selectExistingTabByItemId(targetServerId, viewConstructor)) {
		if (!this._UICreated) {
            this._createUI();
        }
                               
        this._contentView.set(certs, targetServerId);
        this._app.pushView(this.getContentViewId());
    }
}


//Cert Actions
//1. New Wizards
//2. Edit Wizards
ZaCertViewController.initToolbarMethod =
function () {
	this._toolbarOperations.push(new ZaOperation(ZaOperation.REFRESH, com_zimbra_cert_manager.TBB_Refresh, com_zimbra_cert_manager.TBB_Refresh_tt, "Refresh", "Refresh", new AjxListener(this, ZaCertViewController.prototype.refreshListener)));	
   	this._toolbarOperations.push(new ZaOperation(ZaOperation.NEW, com_zimbra_cert_manager.TBB_launch_cert_wizard, com_zimbra_cert_manager.TBB_launch_cert_wizard_tt, "InstallCertificate", "InstallCertificate", new AjxListener(this, ZaCertViewController.prototype._newCertListener)));				
	this._toolbarOperations.push(new ZaOperation(ZaOperation.NONE));
	this._toolbarOperations.push(new ZaOperation(ZaOperation.HELP, com_zimbra_cert_manager.TBB_Help, com_zimbra_cert_manager.TBB_Help_tt, "Help", "Help", new AjxListener(this, this._helpButtonListener)));				
}

ZaController.initToolbarMethods["ZaCertViewController"].push(ZaCertViewController.initToolbarMethod);

ZaCertViewController.initPopupMenuMethod =
function () {
    this._popupOperations.push(new ZaOperation(ZaOperation.VIEW, com_zimbra_cert_manager.TBB_View, com_zimbra_cert_manager.PQTBB_View_tt, "Properties", "PropertiesDis", new AjxListener(this, ZaCertViewController.prototype._viewButtonListener)));
}
ZaController.initPopupMenuMethods["ZaCertViewController"].push(ZaCertViewController.initPopupMenuMethod);

ZaCertViewController.prototype._createUI = function () {
	try {
		var elements = new Object();
		this._contentView = new ZaCertView( this._container, this._app );
		this._initToolbar();
		if(this._toolbarOperations && this._toolbarOperations.length) {
			this._toolbar = new ZaToolBar(this._container, this._toolbarOperations);
		}

        elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;
        if (!appNewUI) {
            if (this._toolbar)
                elements[ZaAppViewMgr.C_TOOLBAR_TOP] = this._toolbar;

            var tabParams = {
                openInNewTab: true,
                tabId: this.getContentViewId(),
                tab: this.getMainTab()
            }
            this._app.createView(this.getContentViewId(), elements, tabParams) ;
        } else {
            ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements);
        }
		//this._contentView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
		//this._contentView.addActionListener(new AjxListener(this, this._listActionListener));			
	
		this._UICreated = true;
		this._app._controllers[this.getContentViewId ()] = this ;
		
	} catch (ex) {
		this._handleException(ex, "ZaCertViewController.prototype._createUI", null, false);
		return;
	}	
}


ZaCertViewController.prototype._newCertListener = function (ev) {
	if(window.console && window.console.log) console.log("ZaCertViewController.prototype._newCertListener: Launch the new certificates wizard ... ") ;
	ZaCert.launchNewCertWizard.call (this, this._contentView.getTargetServerId()) ;
}


ZaCertViewController.prototype._editCertListener = function (ev) {
	if(window.console && window.console.log) console.log("Launch the certificate modifications wizard ... ") ;
	
}

ZaCertViewController.prototype.refreshListener = function (ev) {
	if(window.console && window.console.log) console.log("Refresh the certificates ... ") ;
	this.show(ZaCert.getCerts(this._app, this._contentView.getTargetServerId ()), this._contentView.getTargetServerId ()) ;
}

