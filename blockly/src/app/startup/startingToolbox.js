// The weird underscore prefixes are used by x2Js library to help turn this back into XML for
// consumption by the Blockly API.
mdc.toolbox =
	{
		'xml': {
			'category': [{
				'block': {
					'statement': {
						'block': {
							'statement': {
								'block': {
									'_type': 'relation'
								},
								'_name': 'Relations'
							},
							'next': {
								'block': {
									'statement': {
										'block': {
											'next': {
												'block': {
													'_type': 'relation'
												}
											},
											'_type': 'relation'
										},
										'_name': 'Relations'
									},
									'_type': 'namespace'
								}
							},
							'_type': 'namespace'
						},
						'_name': 'namespaces'
					},
					'value': {
						'block': {
							'field': {
								'_name': 'title',
								'__text': 'useCaseLayout'
							},
							'statement': {
								'block': {
									'field': {
										'_name': 'title',
										'__text': 'layoutTitle'
									},
									'statement': {
										'block': {
											'field': [{
												'_name': 'title',
												'__text': 'viewTitle'
											},
											{
												'_name': 'namespace',
												'__text': 'OPTIONNAME'
											},
											{
												'_name': 'relation',
												'__text': 'OPTIONNAME'
											},
											{
												'_name': 'propertyName'
											}],
											'_type': 'dataView_ShortTextView'
										},
										'_name': 'children'
									},
									'_type': 'layout_UserProfileHeaderLayout'
								},
								'_name': 'children'
							},
							'_type': 'appLayout_LeftSideNavAppLayout'
						},
						'_name': 'appLayout'
					},
					'_type': 'usecase'
				},
				'_name': 'Layouts and Predefines'
			},
			{
				'block': [{
					'_type': 'usecase'
				},
				{
					'_type': 'namespace'
				},
				{
					'_type': 'relation'
				}],
				'_name': 'App Foundation',
				'_colour': '#595959'
			},
			{
				'_name': 'Access Modifiers',
				'_colour': '#000',
				'block': [
					{
						'_type': 'hiddenfor'
					},
					{
						'_type': 'addforfeatureflags'
					},
					{
						'_type': 'removeforfeatureflag'
					},
					{
						'_type': 'readonlyfor'
					}
				]
			}],
			'_xmlns': 'http://www.w3.org/1999/xhtml',
			'_id': 'toolbox',
			'_style': 'display: none;'
		}
	};